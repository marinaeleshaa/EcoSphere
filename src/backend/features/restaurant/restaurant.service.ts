import { inject, injectable } from "tsyringe";
import type { IRestaurantRepository } from "./restaurant.repository";
import { IRestaurant, IMenuItem } from "./restaurant.model";
import { ImageService } from "../../services/image.service";
import {
  PaginatedRestaurantResponse,
  RestaurantPageOptions,
} from "./dto/restaurant.dto";

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
  getAll(
    options?: RestaurantPageOptions
  ): Promise<PaginatedRestaurantResponse | IRestaurant[]>;
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
    const data = await this.populateAvatar([restaurant]);
    return data[0];
  }

  async getAll(
    options?: RestaurantPageOptions
  ): Promise<PaginatedRestaurantResponse | IRestaurant[]> {
    const result = await this.restaurantRepository.getAll(options);

    if (Array.isArray(result)) {
      return this.populateAvatar(result);
    }

    return {
      ...result,
      data: await this.populateAvatar(result.data),
    };
  }

  async getById(id: string): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.getById(id);
    return await this.populateAvatar(restaurant);
  }

  async getRestaurantsByIds(restIds: string[]): Promise<IRestaurant[]> {
    const rest = await this.restaurantRepository.getRestaurantsByIdes(restIds);
    return rest;
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

  private async populateAvatar(
    restaurants: IRestaurant[]
  ): Promise<IRestaurant[]> {
    if (!restaurants || restaurants.length === 0) return restaurants;

    const allPromises: Promise<void>[] = [];

    const restaurantObjects = restaurants.map((restaurant) =>
      restaurant && typeof (restaurant as any).toObject === "function"
        ? (restaurant as any).toObject()
        : restaurant
    );

    restaurantObjects.forEach((restaurant) => {
      if (!restaurant) return;

      // Restaurant avatar
      if (restaurant.avatar?.key) {
        allPromises.push(
          this.imageService.getSignedUrl(restaurant.avatar.key).then((url) => {
            if (restaurant.avatar) restaurant.avatar.url = url;
          })
        );
      }

      // Menu avatars
      if (restaurant.menus?.length) {
        restaurant.menus.forEach((menu: IMenuItem) => {
          if (menu.avatar?.key) {
            allPromises.push(
              this.imageService.getSignedUrl(menu.avatar.key).then((url) => {
                if (menu.avatar) menu.avatar.url = url;
              })
            );
          }
        });
      }
    });

    await Promise.all(allPromises);
    return restaurantObjects as IRestaurant[];
  }
}
export default RestaurantService;
