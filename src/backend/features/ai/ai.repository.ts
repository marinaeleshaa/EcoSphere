import { injectable, inject } from "tsyringe";
import { type IProductRepository } from "../product/product.repository";
import { type IRestaurantRepository } from "../restaurant/restaurant.repository";
import { type IUserRepository } from "../user/user.repository";
import { type IOrderRepository } from "../orders/order.repository";
import { type IRecycleRepository } from "../recycle/recycle.repository";
import { type IEventRepository } from "../event/event.repository";
import {
  ProductContextDTO,
  RestaurantContextDTO,
  GeneralContextDTO,
  UserContextDTO,
  RestaurantOwnerContextDTO,
} from "./dto/ai-context.dto";

export interface IAIRepository {
  getProductContext(productId: string): Promise<ProductContextDTO | null>;
  getRestaurantContext(
    restaurantId: string
  ): Promise<RestaurantContextDTO | null>;
  getStaticPageContext(pageId: string): string;
  getGlobalStructure(): Promise<string>;
  getGeneralContext(): GeneralContextDTO;
  // NEW: User and restaurant owner contexts
  getUserContext(userId: string): Promise<UserContextDTO>;
  getRestaurantOwnerContext(
    restaurantId: string
  ): Promise<RestaurantOwnerContextDTO>;
}

@injectable()
export class AIRepository implements IAIRepository {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository,
    @inject("IRestaurantRepository")
    private readonly restaurantRepository: IRestaurantRepository,
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @inject("OrderRepository")
    private readonly orderRepository: IOrderRepository,
    @inject("RecycleRepository")
    private readonly recycleRepository: IRecycleRepository,
    @inject("IEventRepository")
    private readonly eventRepository: IEventRepository
  ) {}

  async getProductContext(
    productId: string
  ): Promise<ProductContextDTO | null> {
    const product = await this.productRepository.findProductById(productId);
    if (!product) return null;

    return {
      title: product.title,
      price: product.price,
      description: product.subtitle ?? "No description available",
      availableOnline: product.availableOnline,
      soldBy: product.restaurantName,
    };
  }

  async getRestaurantContext(
    restaurantId: string
  ): Promise<RestaurantContextDTO | null> {
    const restaurant = await this.restaurantRepository.getById(restaurantId);
    if (!restaurant) return null;

    const menus =
      restaurant.menus?.map((m) => ({
        title: m.title ?? "Untitled",
        price: m.price ?? 0,
      })) ?? [];

    return {
      name: restaurant.name,
      description: restaurant.description,
      location: restaurant.location,
      workingHours: restaurant.workingHours,
      menu: menus,
    };
  }

  getStaticPageContext(pageId: string): string {
    return staticPages[pageId] ?? staticPages.default;
  }

  async getGlobalStructure(): Promise<string> {
    try {
      // Use our new analytics methods for efficient stats!
      const [
        users,
        restaurantCount,
        productCount,
        totalRevenue,
        carbonSaved,
        upcomingEvents,
      ] = await Promise.all([
        this.userRepository.getAll(),
        this.restaurantRepository.getTotalRestaurantCount(),
        this.productRepository.getTotalProductCount(),
        this.orderRepository.getTotalRevenue(),
        this.recycleRepository.getTotalCarbonSaved(),
        this.eventRepository.getUpcomingEvents(5),
      ]);

      return `
        REAL TIME DATABASE SNAPSHOT:
        - Total Users: ${users.length}
        - Total Restaurants: ${restaurantCount}
        - Total Products: ${productCount}
        - Total Revenue: $${totalRevenue.toFixed(2)}
        - Carbon Saved: ${carbonSaved.toFixed(2)} kg
        - Upcoming Events: ${upcomingEvents.length}
      `;
    } catch (err) {
      console.error("Failed to fetch global structure", err);
      return "REAL TIME DATABASE SNAPSHOT UNAVAILABLE";
    }
  }

  getGeneralContext(): GeneralContextDTO {
    return {
      systemName: "EcoSphere Assistant",
      goal: "Help users make sustainable choices on the EcoSphere marketplace.",
      features: ["Recycling Services", "Eco-Friendly Products", "Events"],
    };
  }

  // NEW: Get user context for authenticated users
  async getUserContext(userId: string): Promise<UserContextDTO> {
    try {
      const user = await this.userRepository.getById(userId);
      const orders = await this.orderRepository.getOrdersByUser(userId);
      const recycling = await this.recycleRepository.getRecycleEntriesByEmail(
        user.email
      );

      let eventsCount: number | undefined;
      if (user.role === "organizer") {
        const events = await this.eventRepository.getEventsByUserId(userId);
        eventsCount = events.length;
      }

      return {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        points: user.points || 0,
        favoritesCount: user.favoritesIds?.length || 0,
        cartItemsCount: user.cart?.length || 0,
        ordersCount: orders.length,
        recyclingEntriesCount: recycling.length,
        eventsCount,
      };
    } catch (error) {
      console.error("Failed to get user context:", error);
      throw error;
    }
  }

  // NEW: Get restaurant owner context
  async getRestaurantOwnerContext(
    restaurantId: string
  ): Promise<RestaurantOwnerContextDTO> {
    try {
      const restaurant = await this.restaurantRepository.getById(restaurantId);
      const orders = await this.orderRepository.activeOrdersByRestaurantId(
        restaurantId
      );
      const revenue = await this.orderRepository.revenuePerRestaurant(
        restaurantId
      );

      return {
        restaurantId: restaurant._id.toString(),
        name: restaurant.name,
        email: restaurant.email,
        productsCount: restaurant.menus?.length || 0,
        ordersCount: orders.length,
        totalRevenue: revenue[0]?.revenue || 0,
        subscribed: restaurant.subscribed || false,
      };
    } catch (error) {
      console.error("Failed to get restaurant owner context:", error);
      throw error;
    }
  }
}

const staticPages: Record<string, string> = {
  home: "Current Page: Home. The landing page of EcoSphere, featuring our mission, latest news, and quick links.",
  shop: "Current Page: Shops. A directory of all eco-friendly shops and restaurants partnered with EcoSphere.",
  store:
    "Current Page: Store. The marketplace where users can browse and buy sustainable products.",
  recycle:
    "Current Page: Recycle. A map and guide to finding the nearest recycling centers and learning what materials they accept.",
  events:
    "Current Page: Events. A listing of community workshops, clean-up drives, and sustainability seminars.",
  about:
    "Current Page: About Us. Information about EcoSphere's mission, vision, and the team behind it.",
  auth: "Current Page: Authentication. Login or Sign Up to access personalized features like profiles and orders.",
  profile:
    "Current Page: Profile. User's personal dashboard to manage orders, see eco-points, and update settings.",
  cart: "Current Page: Cart. Review selected items before checkout.",
  favorites:
    "Current Page: Favorites. Saved products and shops that the user loves.",
  game: "Current Page: Eco-Game. A fun Tic-Tac-Toe game vs AI to take a break.",
  news: "Current Page: News. Latest articles and updates on sustainability and the environment.",
  dashboard:
    "Current Page: Dashboard. For shop owners and organizers to manage their inventory and events.",
  subscription:
    "Current Page: Subscription. Plans for businesses to partner with EcoSphere.",
};
