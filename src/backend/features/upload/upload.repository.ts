import { UserModel } from "../user/user.model";
import { RestaurantModel } from "../restaurant/restaurant.model";
import { injectable } from "tsyringe";

@injectable()
export class UploadRepository {
  async findUserById(id: string) {
    return await UserModel.findById(id);
  }

  async findRestaurantById(id: string) {
    return await RestaurantModel.findById(id);
  }

  async updateUserAvatar(id: string, key: string) {
    return await UserModel.findByIdAndUpdate(id, { avatar: { key } }, { new: true });
  }

  async updateRestaurantAvatar(id: string, key: string) {
    return await RestaurantModel.findByIdAndUpdate(id, { avatar: { key } }, { new: true });
  }

  async clearUserAvatar(id: string) {
    return await UserModel.findByIdAndUpdate(id, { $unset: { avatar: 1 } }, { new: true });
  }

  async clearRestaurantAvatar(id: string) {
    return await RestaurantModel.findByIdAndUpdate(id, { $unset: { avatar: 1 } }, { new: true });
  }
}
