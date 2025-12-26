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
  getFirstRestaurants(limit?: number): Promise<IRestaurant[]>;
  updateById(id: string, data: Partial<IRestaurant>): Promise<IRestaurant>;
  deleteById(id: string): Promise<IRestaurant>;
}

@injectable()
class RestaurantService implements IRestaurantService {
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
    // Directly use populateSingle for a single object
    return this.populateSingle(restaurant);
  }

  async getAll(
    options?: RestaurantPageOptions
  ): Promise<PaginatedRestaurantResponse | IRestaurant[]> {
    const result = await this.restaurantRepository.getAll(options);

    // Handle the Union Type logic: check if it's a raw array or paginated object
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
    if (!restaurant) throw new Error("Restaurant not found");

    return this.populateSingle(restaurant);
  }

  async getRestaurantsByIds(restIds: string[]): Promise<IRestaurant[]> {
    const restaurants = await this.restaurantRepository.getRestaurantsByIdes(
      restIds
    );
    return this.populateAvatar(restaurants);
  }

  async getFirstRestaurants(limit: number = 15): Promise<IRestaurant[]> {
    const restaurants = await this.restaurantRepository.getFirstRestaurants(
      limit
    );
    return this.populateAvatar(restaurants);
  }

  async updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.updateById(id, data);
    if (!restaurant) throw new Error("Restaurant not found");

    return this.populateSingle(restaurant);
  }

  async deleteById(id: string): Promise<IRestaurant> {
    const restaurant = await this.restaurantRepository.deleteById(id);
    if (!restaurant) throw new Error("Restaurant not found");

    return this.populateSingle(restaurant);
  }

  private async populateSingle(restaurant: IRestaurant): Promise<IRestaurant> {
    const restaurantObj = (restaurant as any).toObject?.() ?? restaurant;
    const allPromises: Promise<void>[] = [];

    if (restaurantObj.avatar?.key) {
      allPromises.push(
        this.imageService.getSignedUrl(restaurantObj.avatar.key).then((url) => {
          if (restaurantObj.avatar) restaurantObj.avatar.url = url;
        })
      );
    }

    if (restaurantObj.menus?.length) {
      restaurantObj.menus.forEach((menu: IMenuItem) => {
        if (menu.avatar?.key) {
          allPromises.push(
            this.imageService.getSignedUrl(menu.avatar.key).then((url) => {
              if (menu.avatar) menu.avatar.url = url;
            })
          );
        }
      });
    }

    await Promise.all(allPromises);
    return restaurantObj as IRestaurant;
  }

  private async populateAvatar(
    restaurants: IRestaurant[]
  ): Promise<IRestaurant[]> {
    if (!restaurants?.length) return restaurants;

    return Promise.all(restaurants.map((r) => this.populateSingle(r)));
  }
}

export default RestaurantService;
