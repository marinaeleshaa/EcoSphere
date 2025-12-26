import { injectable, inject } from "tsyringe";
import { type IProductRepository } from "../product/product.repository";
import { type IRestaurantRepository } from "../restaurant/restaurant.repository";
import { type IUserRepository } from "../user/user.repository";
import { type IOrderRepository } from "../orders/order.repository";
import { type IRecycleRepository } from "../recycle/recycle.repository";
import { type IEventRepository } from "../event/event.repository";

/**
 * Tool Executor - Handles execution of function calls from the LLM
 * WITH AUTHENTICATION AND AUTHORIZATION
 */

interface SessionInfo {
  userId?: string;
  restaurantId?: string;
  userRole?: string;
}

@injectable()
export class ToolExecutor {
  constructor(
    @inject("ProductRepository")
    private readonly productRepo: IProductRepository,
    @inject("IRestaurantRepository")
    private readonly restaurantRepo: IRestaurantRepository,
    @inject("IUserRepository")
    private readonly userRepo: IUserRepository,
    @inject("OrderRepository")
    private readonly orderRepo: IOrderRepository,
    @inject("RecycleRepository")
    private readonly recycleRepo: IRecycleRepository,
    @inject("IEventRepository")
    private readonly eventRepo: IEventRepository
  ) {}

  async executeTool(
    toolName: string,
    args: any,
    session?: SessionInfo
  ): Promise<any> {
    try {
      // Check if this is a CRUD operation that requires auth
      if (this.requiresAuth(toolName)) {
        this.checkAuthentication(toolName, session);
        this.checkAuthorization(toolName, session);
      }

      switch (toolName) {
        // ==================== PRODUCT READ METHODS ====================
        case "getProductsByCategory":
          return await this.productRepo.getProductsByCategory(
            args.category,
            args.limit || 10
          );

        case "getProductCategoryCounts":
          return await this.productRepo.getProductCategoryCounts();

        case "getTopProductsByRating":
          return await this.productRepo.getTopProductsByRating(
            args.limit || 10
          );

        case "getCheapestProducts":
          return await this.productRepo.getCheapestProducts(args.limit || 10);

        case "getMostSustainableProducts":
          return await this.productRepo.getMostSustainableProducts(
            args.limit || 10
          );

        case "getTotalProductCount":
          return await this.productRepo.getTotalProductCount();

        // ==================== RESTAURANT READ METHODS ====================
        case "getRestaurantsByCategory":
          return await this.restaurantRepo.getRestaurantsByCategory(
            args.category,
            args.limit || 10
          );

        case "getRestaurantCategoryCounts":
          return await this.restaurantRepo.getRestaurantCategoryCounts();

        case "getTopRestaurantsByRating":
          return await this.restaurantRepo.getTopRestaurantsByRating(
            args.limit || 10
          );

        case "getTotalRestaurantCount":
          return await this.restaurantRepo.getTotalRestaurantCount();

        case "getRestaurantsWithMostProducts":
          return await this.restaurantRepo.getRestaurantsWithMostProducts(
            args.limit || 10
          );

        // ==================== RECYCLE READ METHODS ====================
        case "getTotalCarbonSaved":
          return await this.recycleRepo.getTotalCarbonSaved();

        case "getPendingRecyclingRequests":
          return await this.recycleRepo.getPendingRecyclingRequests(
            args.limit || 10
          );

        case "getRecyclingStatistics":
          return await this.recycleRepo.getRecyclingStatistics();

        case "getRecentRecyclingEntries":
          return await this.recycleRepo.getRecentRecyclingEntries(
            args.limit || 10
          );

        // ==================== ORDER READ METHODS ====================
        case "getRecentOrders":
          return await this.orderRepo.getRecentOrders(args.limit || 10);

        case "getTotalRevenue":
          return await this.orderRepo.getTotalRevenue();

        case "getOrdersByStatus":
          return await this.orderRepo.getOrdersByStatus(
            args.status,
            args.limit || 20
          );

        // ==================== EVENT READ METHODS ====================
        case "getUpcomingEvents":
          return await this.eventRepo.getUpcomingEvents(args.limit || 10);

        case "getTotalEventsCount":
          return await this.eventRepo.getTotalEventsCount();

        case "getEventStatistics":
          return await this.eventRepo.getEventStatistics();

        // ==================== USER READ METHODS ====================
        case "getUserCountByRole":
          return await this.userRepo.getUserCountByRole(args.role);

        case "getRecentUserCount":
          return await this.userRepo.getRecentUserCount(args.days || 30);

        case "getTopUsersByPoints":
          return await this.userRepo.getTopUsersByPoints(args.limit || 10);

        case "getMyPoints":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          const userWithPoints = await this.userRepo.getById(
            session.userId,
            "points"
          );
          return { points: userWithPoints.points || 0 };

        case "viewMyCart":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          const userWithCart = await this.userRepo.getById(
            session.userId,
            "cart"
          );
          const cartItems = userWithCart.cart || [];

          // Enrich cart items with product details
          const enrichedCart = await Promise.all(
            cartItems.map(async (item: any) => {
              const product = await this.productRepo.findProductById(
                item.productId.toString()
              );
              return {
                ...item,
                productTitle: product?.title || "Unknown Product",
                productPrice: product?.price || 0,
              };
            })
          );
          return enrichedCart;

        case "viewMyFavorites":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          const userWithFavs = await this.userRepo.getById(
            session.userId,
            "favoritesIds"
          );
          if (
            !userWithFavs.favoritesIds ||
            userWithFavs.favoritesIds.length === 0
          ) {
            return [];
          }
          return await this.userRepo.getFavoriteMenuItems(
            userWithFavs.favoritesIds as any
          );

        // ==================== CUSTOMER CRUD OPERATIONS ====================
        case "addToCart":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          // Get current user to access cart
          const user = await this.userRepo.getById(session.userId, "cart");
          const currentCart = user.cart || [];

          // Check if product already in cart
          const existingIndex = currentCart.findIndex(
            (item) => item.productId === args.productId
          );

          if (existingIndex >= 0) {
            // Update quantity
            currentCart[existingIndex].quantity += args.quantity || 1;
          } else {
            // Add new item (cast to any since saveCart will handle it)
            currentCart.push({
              restaurantId: "",
              productId: args.productId,
              quantity: args.quantity || 1,
            } as any);
          }

          await this.userRepo.saveCart(session.userId, currentCart);
          return { success: true, message: "Product added to cart" };

        case "removeFromCart":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          const userForRemove = await this.userRepo.getById(
            session.userId,
            "cart"
          );
          const cartForRemove = (userForRemove.cart || []).filter(
            (item) => item.productId !== args.productId
          );
          await this.userRepo.saveCart(session.userId, cartForRemove);
          return { success: true, message: "Product removed from cart" };

        case "updateCartQuantity":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          const userForUpdate = await this.userRepo.getById(
            session.userId,
            "cart"
          );
          const cartForUpdate = userForUpdate.cart || [];
          const index = cartForUpdate.findIndex(
            (item) => item.productId === args.productId
          );
          if (index >= 0) {
            cartForUpdate[index].quantity = args.quantity;
          }
          await this.userRepo.saveCart(session.userId, cartForUpdate);
          return { success: true, message: "Cart quantity updated" };

        case "clearCart":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          await this.userRepo.saveCart(session.userId, []);
          return { success: true, message: "Cart cleared" };

        case "addToFavorites":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          await this.userRepo.addToFavorites(session.userId, args.productId);
          return { success: true, message: "Added to favorites" };

        case "removeFromFavorites":
          if (!session?.userId) throw new Error("AUTHENTICATION_REQUIRED");
          await this.userRepo.removeFromFavorites(
            session.userId,
            args.productId
          );
          return { success: true, message: "Removed from favorites" };

        // ==================== RESTAURANT CRUD OPERATIONS ====================
        case "createProduct":
          if (!session?.restaurantId)
            throw new Error("RESTAURANT_AUTH_REQUIRED");
          await this.productRepo.addProduct(session.restaurantId, {
            title: args.title,
            subtitle: args.description || "",
            price: args.price,
            category: args.category,
            availableOnline: args.availableOnline ?? true,
          } as any);
          return { success: true, message: "Product created successfully" };

        case "updateProduct":
          if (!session?.restaurantId)
            throw new Error("RESTAURANT_AUTH_REQUIRED");
          const updateData: any = {};
          if (args.title) updateData.title = args.title;
          if (args.price) updateData.price = args.price;
          if (args.description) updateData.description = args.description;
          if (args.category) updateData.category = args.category;
          if (args.availableOnline !== undefined)
            updateData.availableOnline = args.availableOnline;

          await this.productRepo.updateProduct(
            session.restaurantId,
            args.productId,
            {
              ...args,
              subtitle: args.description, // map description to subtitle
            } as any
          );
          return { success: true, message: "Product updated successfully" };

        case "deleteProduct":
          if (!session?.restaurantId)
            throw new Error("RESTAURANT_AUTH_REQUIRED");
          await this.productRepo.deleteProduct(
            session.restaurantId,
            args.productId
          );
          return { success: true, message: "Product deleted successfully" };

        case "toggleProductAvailability":
          if (!session?.restaurantId)
            throw new Error("RESTAURANT_AUTH_REQUIRED");
          await this.productRepo.updateProduct(
            session.restaurantId,
            args.productId,
            { availableOnline: args.available }
          );
          return {
            success: true,
            message: `Product marked as ${
              args.available ? "available" : "unavailable"
            }`,
          };

        case "updateOrderStatus":
          if (!session?.restaurantId)
            throw new Error("RESTAURANT_AUTH_REQUIRED");

          const order = await this.orderRepo.getOrderById(args.orderId);
          if (!order) throw new Error("Order not found");

          // Check if order belongs to this restaurant
          if (order.restaurantId !== session.restaurantId) {
            throw new Error("UNAUTHORIZED_ORDER_ACCESS");
          }

          await this.orderRepo.updateOrderStatus(args.orderId, {
            status: args.status,
          } as any);

          return {
            success: true,
            message: `Order status updated to ${args.status}`,
          };

        // ==================== ORGANIZER CRUD OPERATIONS ====================
        case "createEvent":
          if (!session?.userId || session.userRole !== "organizer")
            throw new Error("ORGANIZER_AUTH_REQUIRED");

          const newEvent = await this.eventRepo.createEvent(session.userId, {
            name: args.title,
            eventDate: new Date(args.date),
            locate: args.location,
            description: args.description,
            capacity: args.capacity || 50,
            ticketPrice: args.ticketPrice || 0,
            type: args.type,
            startTime: args.startTime,
            endTime: args.endTime,
            isAccepted: false,
            isEventNew: true,
          } as any);

          return {
            success: true,
            message: "Event created successfully and is pending approval",
            eventId: (newEvent as any)._id,
          };

        case "updateEvent":
          if (!session?.userId || session.userRole !== "organizer")
            throw new Error("ORGANIZER_AUTH_REQUIRED");

          const updatedEvent = await this.eventRepo.updateEvent(
            session.userId,
            {
              _id: args.eventId,
              name: args.title,
              locate: args.location,
              ...args,
            } as any
          );

          return {
            success: true,
            message: "Event updated successfully",
            event: updatedEvent,
          };

        case "deleteEvent":
          if (!session?.userId || session.userRole !== "organizer")
            throw new Error("ORGANIZER_AUTH_REQUIRED");

          await this.eventRepo.deleteEvent(session.userId, args.eventId);

          return {
            success: true,
            message: "Event deleted successfully",
          };

        // ==================== RECYCLEMAN CRUD OPERATIONS ====================
        case "updateRecyclingRequestStatus":
          if (!session?.userId || session.userRole !== "recycleMan")
            throw new Error("RECYCLEMAN_AUTH_REQUIRED");

          await this.recycleRepo.updateRecycleEntry(args.requestId, {
            status: args.status,
            isVerified: args.status === "completed",
          } as any);

          return {
            success: true,
            message: `Recycling request ${args.requestId} updated to ${args.status}`,
          };

        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error: any) {
      console.error(`Error executing tool ${toolName}:`, error);

      // Re-throw auth errors for proper handling
      if (
        error.message?.includes("AUTH_REQUIRED") ||
        error.message?.includes("UNAUTHORIZED")
      ) {
        throw error;
      }

      throw new Error(`Tool execution failed: ${error.message}`);
    }
  }

  private requiresAuth(toolName: string): boolean {
    const authRequiredTools = [
      // Customer tools
      "addToCart",
      "removeFromCart",
      "updateCartQuantity",
      "clearCart",
      "addToFavorites",
      "removeFromFavorites",
      "viewMyCart",
      "viewMyFavorites",
      "getMyPoints",
      // Restaurant tools
      "createProduct",
      "updateProduct",
      "deleteProduct",
      "toggleProductAvailability",
      "updateOrderStatus",
      // Organizer tools
      "createEvent",
      "updateEvent",
      "deleteEvent",
      // RecycleMan tools
      "updateRecyclingRequestStatus",
    ];
    return authRequiredTools.includes(toolName);
  }

  private checkAuthentication(toolName: string, session?: SessionInfo): void {
    if (!session) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    // Check customer auth
    if (
      [
        "addToCart",
        "removeFromCart",
        "updateCartQuantity",
        "clearCart",
        "addToFavorites",
        "removeFromFavorites",
        "viewMyCart",
        "viewMyFavorites",
        "getMyPoints",
      ].includes(toolName)
    ) {
      if (!session.userId) {
        throw new Error("AUTHENTICATION_REQUIRED");
      }
    }

    // Check restaurant auth
    if (
      [
        "createProduct",
        "updateProduct",
        "deleteProduct",
        "toggleProductAvailability",
        "updateOrderStatus",
      ].includes(toolName)
    ) {
      if (!session.restaurantId) {
        throw new Error("RESTAURANT_AUTH_REQUIRED");
      }
    }

    // Check organizer auth
    if (["createEvent", "updateEvent", "deleteEvent"].includes(toolName)) {
      if (!session.userId || session.userRole !== "organizer") {
        throw new Error("ORGANIZER_AUTH_REQUIRED");
      }
    }

    // Check recycleMan auth
    if (["updateRecyclingRequestStatus"].includes(toolName)) {
      if (!session.userId || session.userRole !== "recycleMan") {
        throw new Error("RECYCLEMAN_AUTH_REQUIRED");
      }
    }
  }

  private checkAuthorization(toolName: string, session?: SessionInfo): void {
    // Additional authorization checks can be added here
    // For now, authentication is sufficient
    // In the future, add ownership checks, rate limiting, etc.
  }
}
