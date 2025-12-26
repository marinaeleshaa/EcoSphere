export interface ProductContextDTO {
  title: string;
  price: number;
  description: string;
  availableOnline: boolean;
  soldBy: string;
}

export interface MenuItemDTO {
  title: string;
  price: number;
}

export interface RestaurantContextDTO {
  name: string;
  description: string;
  location: string;
  workingHours: string;
  menu: MenuItemDTO[];
}

export interface GeneralContextDTO {
  systemName: string;
  goal: string;
  features: string[];
}

// NEW: Message interface for conversation history
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// NEW: User context DTO for authenticated users
export interface UserContextDTO {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "organizer" | "admin" | "recycleMan";
  points: number;
  favoritesCount: number;
  cartItemsCount: number;
  ordersCount?: number;
  recyclingEntriesCount?: number;
  eventsCount?: number;
}

// NEW: Restaurant owner context DTO
export interface RestaurantOwnerContextDTO {
  restaurantId: string;
  name: string;
  email: string;
  productsCount: number;
  ordersCount: number;
  totalRevenue?: number;
  subscribed: boolean;
}

// UPDATED: Chat request DTO with conversation history
export interface ChatRequestDTO {
  message: string;
  conversationHistory?: Message[]; // NEW
  context?: { type: types; id?: string };
  locale?: string; // Keep for now, will be removed in Phase 1
}

// UPDATED: Added "user" type
export type types = "product" | "restaurant" | "static" | "user";
