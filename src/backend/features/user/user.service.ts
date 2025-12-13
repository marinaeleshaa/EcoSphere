import { inject, injectable } from "tsyringe";
import { type IUserRepository } from "./user.repository";
import { type ICouponService } from "../discountCoupon/coupon.service";
import { ICart, IUser } from "./user.model";
import { ImageService } from "../../services/image.service";
import { DashboardUsers } from "./user.types";
import { randomInt } from "node:crypto";
import { ICoupon } from "../discountCoupon/coupon.model";
import { sendRedeemingMail } from "@/backend/utils/mailer";
import type { IRestaurantRepository } from "../restaurant/restaurant.repository";
import { IProductCart } from "@/types/ProductType";
import { Types } from "mongoose";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getDashBoardData(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>,
  ): Promise<DashboardUsers>;
  redeemUserPoints(userId: string): Promise<{ message: string }>;
  getUserIdByEmail(email: string): Promise<IUser>;
  getCart(userId: string): Promise<{ success: boolean; items: IProductCart[] }>;
  saveUserCart(userId: string, cart: ICart[]): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
}

@injectable()
class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("IRestaurantRepository")
    private readonly restRepo: IRestaurantRepository,
    @inject("CouponService") private readonly couponService: ICouponService,
    @inject("ImageService") private readonly imageService: ImageService,
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userRepository.getAll();
    return await Promise.all(users.map((user) => this.populateAvatar(user)));
  }

  async getDashBoardData(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>,
  ): Promise<DashboardUsers> {
    const result = await this.userRepository.getUsersByRoleAdvanced({
      limit,
      sortBy,
      sortOrder,
      selectFields,
    });
    return result;
  }

  async redeemUserPoints(userId: string): Promise<{ message: string }> {
    const user = await this.getById(userId); // "points email firstName as a second param"
    if (!user.points || user.points <= 0) {
      throw new Error("User has no enough points to redeem.");
    }
    // 2. Calculate rate based on points
    const rate = this.calculateRateFromPoints(user.points);
    // 3. Generate secure 6-digit code
    const code = this.generateCode();
    const validTo = new Date();
    validTo.setDate(validTo.getDate() + 7);

    await this.couponService.createCoupon({
      code,
      rate,
      validTo,
      numberOfUse: 0,
      maxNumberOfUse: 1,
      createdBy: userId,
      source: "redeem",
    } as ICoupon);
    await this.userRepository.redeemPoints(userId);
    // 7. Send email
    await sendRedeemingMail(user.email, user.firstName, code, validTo, rate);
    // 8. Return response
    return {
      message: "A coupon has been sent to your email.",
    };
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    return await this.populateAvatar(user);
  }
  async getUserIdByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getUserIdByEmail(email);
    if (!user) throw new Error("User not found");
    return await this.populateAvatar(user);
  }

  async getCart(
    userId: string,
  ): Promise<{ success: boolean; items: IProductCart[] }> {
    const user = await this.userRepository.getById(userId);
    if (!user?.cart || user.cart.length === 0) {
      return {
        success: true,
        items: [],
      };
    }

    const restaurantIds = [
      ...new Set(
        user.cart
          .map((item) => item.restaurantId)
          .filter((id): id is string => !!id && Types.ObjectId.isValid(id)),
      ),
    ];

    const rests = await this.restRepo.getRestaurantsByIdes(restaurantIds);

    // Step 4: Create lookup map for efficient access
    // Key format: "restaurantId-menuItemId"
    const menuItemMap = new Map();

    rests.forEach((restaurant) => {
      if (restaurant.menus && restaurant.menus.length > 0) {
        restaurant.menus.forEach((menu) => {
          const key = `${restaurant._id}-${menu._id}`;
          menuItemMap.set(key, {
            menuItem: menu,
            restaurant: {
              id: `${restaurant._id}`,
              name: restaurant.name,
            },
          });
        });
      }
    });

    const cartItems = await Promise.all(
      user.cart.map(async (cartItem) => {
        const key = `${cartItem.restaurantId}-${cartItem.productId}`;
        const data = menuItemMap.get(key);

        // Menu item not found (deleted or unavailable)
        if (!data) {
          console.warn(`Menu item not found: ${key}`);
          return null;
        }

        const { menuItem, restaurant } = data;

        return {
          // Identifiers
          id: `${menuItem._id}`,
          // Restaurant data
          restaurantId: `${restaurant.id}`,
          shopName: restaurant.name as string,
          shopSubtitle: "food shop",
          // item data
          productImg: await this.populateAvatar(menuItem.avatar?.key as string),
          productName: menuItem.title as string,
          productPrice: +menuItem.price,
          productSubtitle: menuItem.subtitle as string,
          productDescription: "this is very good product",
          // Cart data
          quantity: cartItem.quantity,

          // // Calculated fields
          // subtotal: cartItem.quantity * menuItem.price,
          // inStock: menuItem.availableOnline,

          // // Warnings
          // warnings: !menuItem.availableOnline ? ["Currently unavailable"] : [],
        } as IProductCart;
      }),
    );
    const filterdItems = cartItems.filter((item) => item !== null); // Remove deleted items
    console.log("fetching cart done.");
    return {
      success: true,
      items: filterdItems,
    };
  }

  // Needs to Updated later when we have Avatar Upload functionality
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.updateById(id, data);
    return await this.populateAvatar(user);
  }

  async saveUserCart(userId: string, cart: ICart[]): Promise<IUser> {
    const savedUser = await this.userRepository.saveCart(userId, cart);
    return savedUser;
  }

  async updateFavorites(id: string, data: string): Promise<IUser> {
    const user = await this.userRepository.updateFavorites(id, data);
    return await this.populateAvatar(user);
  }

  async deleteById(id: string): Promise<IUser> {
    const user = await this.userRepository.deleteById(id);
    return await this.populateAvatar(user);
  }

  private async populateAvatar(user: IUser): Promise<IUser>;
  private async populateAvatar(user: string): Promise<string>;

  private async populateAvatar(user: IUser | string): Promise<IUser | string> {
    // this is overloading don't remove it
    if (typeof user === "string")
      return await this.imageService.getSignedUrl(user);

    const userObj =
      user && typeof user.toObject === "function" ? user.toObject() : user;

    if (userObj?.avatar?.key) {
      userObj.avatar.url = await this.imageService.getSignedUrl(
        userObj.avatar.key,
      );
    }
    return userObj as IUser;
  }

  private calculateRateFromPoints(points: number): number {
    const rate = points * 0.01; // 0.01% per point
    return Math.min(rate, 30); // hard-cap to 30% max
  }

  private generateCode(): string {
    return randomInt(100000, 999999).toString();
  }
}

export default UserService;
