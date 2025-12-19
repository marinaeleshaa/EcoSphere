import { inject, injectable } from "tsyringe";
import type { IRestaurantService } from "./restaurant.service";
import { IRestaurant } from "./restaurant.model";
import { mapResponseToIShop } from "./dto/restaurant.dto";
import { IShop } from "@/types/ShopTypes";

@injectable()
class RestaurantController {
  constructor(
    @inject("IRestaurantService")
    private readonly restaurantService: IRestaurantService
  ) {}
  async create(body: {
    email: string;
    password: string;
    location: string;
    name: string;
    workingHours: string;
    phoneNumber: string;
    avatar: string;
    description: string;
  }): Promise<IShop> {
    const restaurant = await this.restaurantService.create(
      body.email,
      body.password,
      body.location,
      body.name,
      body.workingHours,
      body.phoneNumber,
      body.avatar,
      body.description
    );
    return mapResponseToIShop(restaurant);
  }
  async getAll(): Promise<IShop[]> {
    const restaurants = await this.restaurantService.getAll();
    return restaurants.map(mapResponseToIShop);
  }
  async getById(id: string): Promise<IShop> {
    const restaurant = await this.restaurantService.getById(id);
    return mapResponseToIShop(restaurant);
  }
  async updateById(id: string, data: Partial<IRestaurant>): Promise<IShop> {
    const restaurant = await this.restaurantService.updateById(id, data);
    return mapResponseToIShop(restaurant);
  }
  async deleteById(id: string): Promise<IShop> {
    const restaurant = await this.restaurantService.deleteById(id);
    return mapResponseToIShop(restaurant);
  }
}
export default RestaurantController;
