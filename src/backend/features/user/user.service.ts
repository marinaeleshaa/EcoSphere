import { inject, injectable } from "tsyringe";
import { type IUserRepository } from "./user.repository";
import { type ICouponService } from "../discountCoupon/coupon.service";
import { IUser } from "./user.model";
import { ImageService } from "../../services/image.service";
import { DashboardUsers } from "./user.types";
import { randomInt } from "node:crypto";
import { ICoupon } from "../discountCoupon/coupon.model";
import { sendForgetPasswordMail, sendRedeemingMail } from "@/backend/utils/mailer";
import { IMenuItem } from "../restaurant/restaurant.model";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string, query?: string): Promise<IUser>;
  getFavoriteMenuItems(itemIds: string[]): Promise<IMenuItem[]>;
  getDashBoardData(
    limit?: number,
    sortBy?: string,
    sortOrder?: 1 | -1,
    selectFields?: string | Record<string, 0 | 1>
  ): Promise<DashboardUsers>;
  redeemUserPoints(userId: string): Promise<{ message: string }>;
  getUserIdByEmail(email: string): Promise<IUser>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser>;
  updateFavorites(id: string, data: string): Promise<IUser>;
  deleteById(id: string): Promise<IUser>;
  sendForgetPasswordEmail(email: string): Promise<{ message: string }>;
  verifyCode(email: string, code: string): Promise<{ message: string }>;
  resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }>;
}

@injectable()
class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
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
      validTo
    );

    // Send Email
    await sendForgetPasswordMail(email, user.firstName, code, validTo);

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

    await this.userRepository.updateById(userId._id.toString(), {password: newPassword});

    return {
      message: "Password has been reset successfully.",
    };
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

  async getUserIdByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getUserIdByEmail(email);
    if (!user) throw new Error("User not found");
    return await this.populateAvatar(user);
  }

  // Needs to Updated later when we have Avatar Upload functionality
  async updateById(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.updateById(id, data);
    return await this.populateAvatar(user);
  }

  async updateFavorites(id: string, data: string): Promise<IUser> {
    const user = await this.userRepository.updateFavorites(id, data);
    return await this.populateAvatar(user);
  }

  async getFavoriteMenuItems(itemIds: string[]): Promise<IMenuItem[]> {
    return await this.userRepository.getFavoriteMenuItems(itemIds);
  }

  async deleteById(id: string): Promise<IUser> {
    const user = await this.userRepository.deleteById(id);
    return await this.populateAvatar(user);
  }

  private async populateAvatar(user: IUser): Promise<IUser> {
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
