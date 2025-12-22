import { inject, injectable } from "tsyringe";
import { type IUserRepository } from "./user.repository";
import { type ICouponService } from "../discountCoupon/coupon.service";
import { ICart, IUser } from "./user.model";
import { ImageService } from "../../services/image.service";
import { DashboardUsers } from "./user.types";
import { randomInt } from "node:crypto";
import { ICoupon } from "../discountCoupon/coupon.model";
import {
  sendForgetPasswordMail,
  sendRedeemingMail,
} from "@/backend/utils/mailer";
import { IProductCart, IProduct } from "@/types/ProductType";
import { Types } from "mongoose";
import type { IRestaurantRepository } from "../restaurant/restaurant.repository";
import {
  mapResponseToIProduct,
  ProductResponse,
} from "../product/dto/product.dto";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string, query?: string): Promise<IUser>;
  getFavoriteMenuItems(itemIds: string[]): Promise<IProduct[]>;
  getDashBoardData(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>
  ): Promise<DashboardUsers>;
  redeemUserPoints(userId: string): Promise<{ message: string }>;
  getUserIdByEmail(email: string): Promise<IUser>;
  getCart(userId: string): Promise<{ success: boolean; items: IProductCart[] }>;
  saveUserCart(userId: string, cart: ICart[]): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
  sendForgetPasswordEmail(email: string): Promise<{ message: string }>;
  verifyCode(email: string, code: string): Promise<{ message: string }>;
  resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;

  /**
   * Update subscription fields for a user. Called from webhook-handling services.
   */
  updateSubscription(
    userId: string,
    data: Partial<{
      subscribed: boolean;
      subscriptionPeriod?: Date;
      stripeCustomerId?: string;
    }>
  ): Promise<IUser>;
}

@injectable()
class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("IRestaurantRepository")
    private readonly restRepo: IRestaurantRepository,
    @inject("CouponService") private readonly couponService: ICouponService,
    @inject("ImageService") private readonly imageService: ImageService
  ) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.userRepository.getAll();
    return await Promise.all(users.map((user) => this.populateAvatar(user)));
  }

  async getById(id: string, query?: string): Promise<IUser> {
    const user = await this.userRepository.getById(id, query);
    return await this.populateAvatar(user);
  }

  async getDashBoardData(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>
  ): Promise<DashboardUsers> {
    const result = await this.userRepository.getUsersByRoleAdvanced({
      limit,
      sortBy,
      sortOrder,
      selectFields,
    });
    return result;
  }

  async sendForgetPasswordEmail(email: string): Promise<{ message: string }> {
    const userId = await this.userRepository.getUserIdByEmail(email);
    if (!userId) throw new Error("User not found");

    const user = await this.getById(userId._id.toString(), "firstName");

    const code = this.generateCode();
    const validTo = new Date();
    validTo.setMinutes(validTo.getMinutes() + 15); // 15 Minutes validity

    await this.userRepository.savePasswordResetCode(
      userId._id.toString(),
      code,
      validTo.toLocaleString()
    );

    // Send Email
    await sendForgetPasswordMail(
      email,
      user.firstName,
      code,
      validTo.toLocaleString()
    );

    return {
      message: "A password reset code has been sent to your email.",
    };
  }

  async verifyCode(email: string, code: string): Promise<{ message: string }> {
    const userId = await this.userRepository.getUserIdByEmail(email);
    if (!userId) throw new Error("User not found");

    const user = await this.getById(userId._id.toString(), "resetCode");

    const isValid =
      user.resetCode?.code === code &&
      user.resetCode?.validTo &&
      new Date() < new Date(user.resetCode.validTo);

    if (!isValid) {
      throw new Error("Invalid or expired code.");
    }

    return {
      message: "Code verified successfully.",
    };
  }

  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const userId = await this.userRepository.getUserIdByEmail(email);
    if (!userId) throw new Error("User not found");

    await this.userRepository.updateById(userId._id.toString(), {
      password: newPassword,
    });

    return {
      message: "Password has been reset successfully.",
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.userRepository.getById(userId, "password");
    if (!user) {
      throw new Error("User not found.");
    }

    const isMatch = await this.userRepository.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    if (!isMatch) {
      throw new Error("Current password is incorrect.");
    }

    return {
      message: "Password changed successfully.",
    };
  }

  async redeemUserPoints(userId: string): Promise<{ message: string }> {
    const user = await this.getById(userId, "points email firstName");
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

  async getUserIdByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getUserIdByEmail(email);
    if (!user) throw new Error("User not found");
    return await this.populateAvatar(user);
  }

  async getCart(
    userId: string
  ): Promise<{ success: boolean; items: IProductCart[] }> {
    const user = await this.userRepository.getById(userId, "cart");
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
          .filter((id): id is string => !!id && Types.ObjectId.isValid(id))
      ),
    ];

    const rests = await this.restRepo.getRestaurantsByIdes(restaurantIds);

    console.log("[getCart] Retrieved", rests.length, "restaurants with menus");

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

          // Log first menu item structure
          if (menuItemMap.size === 1) {
            console.log("[getCart] First menu item from restaurant:", {
              menuId: menu._id,
              menuTitle: menu.title,
              hasAvatar: !!menu.avatar,
              avatarStructure: JSON.stringify(menu.avatar),
            });
          }
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

        console.log(
          "[getCart] MenuItem avatar:",
          JSON.stringify(
            {
              menuItemId: menuItem._id?.toString(),
              menuItemTitle: menuItem.title,
              hasAvatar: !!menuItem.avatar,
              avatar: menuItem.avatar,
              avatarKey: menuItem.avatar?.key,
              avatarUrl: menuItem.avatar?.url,
              avatarType: typeof menuItem.avatar,
            },
            null,
            2
          )
        );

        const avatarKey = menuItem.avatar?.key;
        let productImg = "";
        if (avatarKey && typeof avatarKey === "string") {
          try {
            productImg = await this.populateAvatar(avatarKey);
            console.log("[getCart] Generated productImg:", productImg);
          } catch (error) {
            console.error("[getCart] Error generating image URL:", error);
          }
        } else {
          console.log(
            "[getCart] No valid avatar key, productImg will be empty"
          );
        }

        return {
          // Identifiers
          id: `${menuItem._id}`,
          // Restaurant data
          restaurantId: `${restaurant.id}`,
          shopName: restaurant.name as string,
          shopSubtitle: "food shop",
          // item data
          productImg,
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
      })
    );
    const filteredItems = cartItems.filter((item) => item !== null); // Remove deleted items
    return {
      success: true,
      items: filteredItems,
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

  async getFavoriteMenuItems(itemIds: string[]): Promise<IProduct[]> {
    const productResponses = await this.userRepository.getFavoriteMenuItems(
      itemIds
    );
    // Populate avatar URLs before mapping
    const productsWithUrls = await Promise.all(
      productResponses.map((p) => this.attachSignedUrl(p))
    );
    return productsWithUrls.map(mapResponseToIProduct);
  }

  private async attachSignedUrl(
    product: ProductResponse
  ): Promise<ProductResponse> {
    console.log("[userService.attachSignedUrl] Product:", {
      productId: product._id,
      hasAvatar: !!product.avatar,
      avatarKey: product.avatar?.key,
      avatarUrlBefore: product.avatar?.url,
    });

    if (product?.avatar?.key) {
      try {
        const url = await this.imageService.getSignedUrl(product.avatar.key);
        console.log("[userService.attachSignedUrl] Generated URL:", url);
        product.avatar.url = url;
      } catch (error) {
        console.error(
          `Failed to generate signed URL for product ${product._id}:`,
          error
        );
      }
    } else {
      console.log(
        "[userService.attachSignedUrl] No avatar.key found, skipping URL generation"
      );
    }
    return product;
  }

  async deleteById(id: string): Promise<IUser> {
    const user = await this.userRepository.deleteById(id);
    return await this.populateAvatar(user);
  }

  async updateSubscription(
    userId: string,
    data: Partial<{
      subscribed: boolean;
      subscriptionPeriod?: Date;
      stripeCustomerId?: string;
    }>
  ): Promise<IUser> {
    // Use an `unknown` intermediate cast instead of `any` to be explicit and safer.
    // The repository expects `Partial<IUser>`, and the incoming `data` shape is a
    // subset; cast through `unknown` to satisfy the type system without using `any`.
    const user = await this.userRepository.updateById(
      userId,
      data as unknown as Partial<IUser>
    );
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
        userObj.avatar.key
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
