import { inject, injectable } from "tsyringe";
import type { IRestaurantRepository } from "./restaurant.repository";
import { IRestaurant } from "./restaurant.model";
import { ImageService } from "../../services/image.service";

export interface IRestaurantService {
  create(
    email: string,
    password: string,
    location: string,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string
  ): Promise<IRestaurant>;
  getAll(): Promise<IRestaurant[]>;
  getById(id: string): Promise<IRestaurant>;
  updateById(id: string, data: Partial<IRestaurant>): Promise<IRestaurant>;
  deleteById(id: string): Promise<IRestaurant>;
}

@injectable()
class RestaurantService {
  constructor(
    @inject("IRestaurantRepository")
    private readonly restaurantRepository: IRestaurantRepository,
    @inject("ImageService") private readonly imageService: ImageService
  ) {}
  async create(
    email: string,
    password: string,
    location: string,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string
  ): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.create(
      email,
      password,
      location,
      name,
      workingHours,
      phoneNumber,
      avatar,
      description
    );
    return await this.populateAvatar(restaurant);
  }
  async getAll(): Promise<IRestaurant[]> {
    const restaurants = await this.restaurantRepository.getAll();
    return await Promise.all(
      restaurants.map((restaurant) => this.populateAvatar(restaurant))
    );
  }
  async getById(id: string): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.getById(id);
    return await this.populateAvatar(restaurant);
  }
  async updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.updateById(id, data);
    return await this.populateAvatar(restaurant);
  }
  async deleteById(id: string): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.deleteById(id);
    return await this.populateAvatar(restaurant);
  }

  private async populateAvatar(restaurant: IRestaurant): Promise<IRestaurant> {
    const restaurantObj =
      restaurant && typeof restaurant.toObject === "function"
        ? restaurant.toObject()
        : restaurant;

    if (restaurantObj?.avatar?.key) {
      restaurantObj.avatar.url = await this.imageService.getSignedUrl(
        restaurantObj.avatar.key
      );
    }
    return restaurantObj as IRestaurant;
  }
}
export default RestaurantService;
