import { injectable, inject } from "tsyringe";
import { type IProductRepository } from "../product/product.repository";
import { type IRestaurantRepository } from "../restaurant/restaurant.repository";
import {
  ProductContextDTO,
  RestaurantContextDTO,
  GeneralContextDTO,
} from "./dto/ai-context.dto";

export interface IAIRepository {
  getProductContext(productId: string): Promise<ProductContextDTO | null>;
  getRestaurantContext(
    restaurantId: string
  ): Promise<RestaurantContextDTO | null>;
  getStaticPageContext(pageId: string): string;
  getGlobalStructure(): Promise<string>;
  getGeneralContext(): GeneralContextDTO;
}

@injectable()
export class AIRepository implements IAIRepository {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository,
    @inject("IRestaurantRepository")
    private readonly restaurantRepository: IRestaurantRepository
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
      rating: +(product.itemRating ?? 0),
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
      const [restaurantRes, products] = await Promise.all([
        this.restaurantRepository.getAll(),
        this.productRepository.findAllProducts(),
      ]);

      const restaurantList =
        restaurantRes && "data" in restaurantRes
          ? restaurantRes.data
          : restaurantRes;

      const restaurantNames = restaurantList
        .map((r) => `${r.name} (ID: ${r._id})`)
        .join(", ");

      const topProducts = [...products.data]
        .sort((a, b) => Number(b.itemRating ?? 0) - Number(a.itemRating ?? 0))
        .slice(0, 5)
        .map((p) => `${p.title} (ID: ${p._id}, Price: $${p.price})`)
        .join(", ");

      return `
        REAL TIME DATABASE SNAPSHOT:
        - Restaurants: ${restaurantNames || "None available"}.
        - Top Products: ${topProducts || "None available"}.
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
