/**
 * Tool/Function definitions for AI chatbot
 * These allow the LLM to dynamically call backend methods
 */

export const AI_TOOLS = [
  // ==================== PRODUCT METHODS ====================
  {
    type: "function",
    function: {
      name: "getProductsByCategory",
      description:
        "Get products filtered by category (e.g., Fruits, Vegetables, Dairy). Use when user asks for products in a specific category.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Product category name (e.g., 'Fruits', 'Vegetables', 'Dairy', 'Bakery')",
          },
          limit: {
            type: "number",
            description: "Maximum number of products to return (default: 10)",
            default: 10,
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProductCategoryCounts",
      description:
        "Get count of products in each category. Use when user asks 'what categories', 'product types', or 'available categories'.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTopProductsByRating",
      description:
        "Get highest-rated products. Use when user asks for 'top products', 'best rated', 'highest rated', or 'recommended products'.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of products to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCheapestProducts",
      description:
        "Get lowest-priced products. Use when user asks for 'cheap', 'affordable', 'budget', or 'lowest price' products.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of products to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getMostSustainableProducts",
      description:
        "Get products with highest sustainability scores. Use when user asks for 'eco-friendly', 'sustainable', 'green', or 'environmentally friendly' products.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of products to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTotalProductCount",
      description:
        "Get total number of products. Use when user asks 'how many products', 'product count', or 'total products'.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },

  // ==================== RESTAURANT METHODS ====================
  {
    type: "function",
    function: {
      name: "getRestaurantsByCategory",
      description:
        "Get restaurants filtered by category (e.g., Bakery, Cafe, Supermarket). Use when user asks for restaurants in a specific category.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Restaurant category (e.g., 'Bakery', 'Cafe', 'Supermarket', 'Grocery')",
          },
          limit: {
            type: "number",
            description:
              "Maximum number of restaurants to return (default: 10)",
            default: 10,
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRestaurantCategoryCounts",
      description:
        "Get count of restaurants in each category. Use when user asks about restaurant types or categories available.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTopRestaurantsByRating",
      description:
        "Get highest-rated restaurants. Use when user asks for 'top restaurants', 'best shops', or 'highly rated restaurants'.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of restaurants to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTotalRestaurantCount",
      description:
        "Get total number of restaurants/shops. Use when user asks 'how many restaurants', 'shop count'.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRestaurantsWithMostProducts",
      description:
        "Get restaurants with the most product variety. Use when user asks for 'restaurants with most items', 'biggest selection', or 'most variety'.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of restaurants to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },

  // ==================== RECYCLE METHODS ====================
  {
    type: "function",
    function: {
      name: "getTotalCarbonSaved",
      description:
        "Get total carbon emissions saved through recycling. Use when user asks about environmental impact or carbon savings.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getPendingRecyclingRequests",
      description:
        "Get pending recycling pickup requests (for RecycleMan users). Use when user asks about pending requests or pickups.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of requests to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRecyclingStatistics",
      description:
        "Get comprehensive recycling statistics including total entries, carbon saved, and weight recycled. Use for recycling overview.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRecentRecyclingEntries",
      description:
        "Get most recent recycling contributions. Use when user asks about recent recycling activity.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of entries to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },

  // ==================== ORDER METHODS ====================
  {
    type: "function",
    function: {
      name: "getRecentOrders",
      description:
        "Get most recent orders. Use when user asks about recent purchases or order history.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of orders to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTotalRevenue",
      description:
        "Get total platform revenue. Use when admin/restaurant asks about revenue or sales totals.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getOrdersByStatus",
      description:
        "Get orders filtered by status (pending, completed, cancelled). Use when user asks about order status.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["pending", "completed", "cancelled"],
            description: "Order status to filter by",
          },
          limit: {
            type: "number",
            description: "Number of orders to return (default: 20)",
            default: 20,
          },
        },
        required: ["status"],
      },
    },
  },

  // ==================== EVENT METHODS ====================
  {
    type: "function",
    function: {
      name: "getUpcomingEvents",
      description:
        "Get upcoming sustainability events. Use when user asks about events, workshops, or activities.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of events to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTotalEventsCount",
      description:
        "Get total number of events. Use when user asks 'how many events'.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getEventStatistics",
      description:
        "Get comprehensive event statistics including total events, upcoming events, and total attendees.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },

  // ==================== USER METHODS ====================
  {
    type: "function",
    function: {
      name: "getUserCountByRole",
      description:
        "Get count of users by role (customer, organizer, admin, recycleMan). Use when asking about user statistics.",
      parameters: {
        type: "object",
        properties: {
          role: {
            type: "string",
            enum: ["customer", "organizer", "admin", "recycleMan"],
            description:
              "User role to filter by (optional - omit for total count)",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRecentUserCount",
      description:
        "Get number of users who joined recently. Use when asking about user growth or new signups.",
      parameters: {
        type: "object",
        properties: {
          days: {
            type: "number",
            description: "Number of days to look back (default: 30)",
            default: 30,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTopUsersByPoints",
      description:
        "Get users with most eco-points (leaderboard). Use when user asks about top users or points leaderboard.",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of users to return (default: 10)",
            default: 10,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getMyPoints",
      description:
        "Get the current user's available eco-points. Use when user asks 'how many points do I have', 'show my points', or 'what is my balance'. Requires authentication.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },

  // ==================== CUSTOMER CRUD OPERATIONS ====================
  {
    type: "function",
    function: {
      name: "addToCart",
      description:
        "Add a product to user's cart. Use when customer wants to add items to cart. Requires authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product to add",
          },
          quantity: {
            type: "number",
            description: "Quantity to add (default: 1)",
            default: 1,
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "removeFromCart",
      description:
        "Remove a product from user's cart. Use when customer wants to remove items. Requires authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product to remove",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateCartQuantity",
      description:
        "Update quantity of a product in cart. Use when customer wants to change quantity. Requires authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product",
          },
          quantity: {
            type: "number",
            description: "New quantity",
          },
        },
        required: ["productId", "quantity"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "clearCart",
      description:
        "Remove all items from user's cart. Use when customer wants to empty cart. Requires authentication.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "addToFavorites",
      description:
        "Add a product to user's favorites. Use when customer wants to save/favorite items. Requires authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product to favorite",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "removeFromFavorites",
      description:
        "Remove a product from user's favorites. Use when customer wants to unfavorite items. Requires authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product to remove from favorites",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "viewMyCart",
      description:
        "Get all items currently in the user's shopping cart. Use when user asks 'what's in my cart' or 'view cart'. Requires authentication.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "viewMyFavorites",
      description:
        "Get all products the user has added to their favorites. Use when user asks 'show my favorites' or 'view favorites'. Requires authentication.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },

  // ==================== RESTAURANT CRUD OPERATIONS ====================
  {
    type: "function",
    function: {
      name: "createProduct",
      description:
        "Create a new product for restaurant. Use when restaurant owner wants to add a product. Requires restaurant authentication.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Product name/title",
          },
          price: {
            type: "number",
            description: "Product price",
          },
          description: {
            type: "string",
            description: "Product description",
          },
          category: {
            type: "string",
            description: "Product category (e.g., Fruits, Vegetables, Dairy)",
          },
          availableOnline: {
            type: "boolean",
            description: "Whether product is available for online orders",
            default: true,
          },
        },
        required: ["title", "price", "category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateProduct",
      description:
        "Update an existing product. Use when restaurant owner wants to modify product details. Can only update own products. Requires restaurant authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product to update",
          },
          title: {
            type: "string",
            description: "New product title (optional)",
          },
          price: {
            type: "number",
            description: "New price (optional)",
          },
          description: {
            type: "string",
            description: "New description (optional)",
          },
          category: {
            type: "string",
            description: "New category (optional)",
          },
          availableOnline: {
            type: "boolean",
            description: "New availability status (optional)",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deleteProduct",
      description:
        "Delete a product. Use when restaurant owner wants to remove a product. DESTRUCTIVE - should ask for confirmation first. Can only delete own products. Requires restaurant authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product to delete",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "toggleProductAvailability",
      description:
        "Toggle product availability (in stock / out of stock). Use when restaurant wants to mark products as available or unavailable. Requires restaurant authentication.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "ID of the product",
          },
          available: {
            type: "boolean",
            description:
              "New availability status (true = available, false = out of stock)",
          },
        },
        required: ["productId", "available"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateOrderStatus",
      description:
        "Update order status for restaurant orders. Use when restaurant wants to mark order as completed/processing. Can only update orders for own restaurant. Requires restaurant authentication.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "ID of the order to update",
          },
          status: {
            type: "string",
            enum: [
              "pending",
              "preparing",
              "delivering",
              "completed",
              "canceled",
            ],
            description:
              "New order status (pending, preparing, delivering, completed, canceled)",
          },
        },
        required: ["orderId", "status"],
      },
    },
  },

  // ==================== ORGANIZER CRUD OPERATIONS ====================
  {
    type: "function",
    function: {
      name: "createEvent",
      description:
        "Create a new sustainability event. Use when organizer wants to create an event. Requires organizer authentication.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Event title/name",
          },
          date: {
            type: "string",
            description: "Event date (ISO format or natural language)",
          },
          location: {
            type: "string",
            description: "Event location/address",
          },
          description: {
            type: "string",
            description: "Event description",
          },
          type: {
            type: "string",
            enum: [
              "environmental_seminar",
              "community_cleanup",
              "sustainable_brands_showcase",
              "other",
            ],
            description: "Category of the event",
          },
          ticketPrice: {
            type: "number",
            description: "Price of the ticket (0 for free)",
            default: 0,
          },
          capacity: {
            type: "number",
            description: "Maximum number of attendees",
            default: 50,
          },
          startTime: {
            type: "string",
            description: "Event start time (e.g., '10:00 AM')",
          },
          endTime: {
            type: "string",
            description: "Event end time (e.g., '02:00 PM')",
          },
        },
        required: [
          "title",
          "date",
          "location",
          "description",
          "type",
          "startTime",
          "endTime",
        ],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateEvent",
      description:
        "Update an existing event. Use when organizer wants to modify event details. Can only update own events. Requires organizer authentication.",
      parameters: {
        type: "object",
        properties: {
          eventId: {
            type: "string",
            description: "ID of the event to update",
          },
          title: {
            type: "string",
            description: "New event title (optional)",
          },
          date: {
            type: "string",
            description: "New event date (optional)",
          },
          location: {
            type: "string",
            description: "New location (optional)",
          },
          description: {
            type: "string",
            description: "New description (optional)",
          },
          maxAttendees: {
            type: "number",
            description: "New max attendees (optional)",
          },
        },
        required: ["eventId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deleteEvent",
      description:
        "Delete/cancel an event. Use when organizer wants to cancel an event. DESTRUCTIVE - should ask for confirmation. Can only delete own events. Requires organizer authentication.",
      parameters: {
        type: "object",
        properties: {
          eventId: {
            type: "string",
            description: "ID of the event to delete/cancel",
          },
        },
        required: ["eventId"],
      },
    },
  },

  // ==================== RECYCLEMAN CRUD OPERATIONS ====================
  {
    type: "function",
    function: {
      name: "updateRecyclingRequestStatus",
      description:
        "Update status of a recycling request (approve, complete, reject). Use when recycleMan wants to manage requests. Requires recycleMan authentication.",
      parameters: {
        type: "object",
        properties: {
          requestId: {
            type: "string",
            description: "ID of the recycling request",
          },
          status: {
            type: "string",
            enum: ["pending", "review", "rejected", "processing", "completed"],
            description:
              "New status for the request (pending, review, rejected, processing, completed)",
          },
        },
        required: ["requestId", "status"],
      },
    },
  },
];
