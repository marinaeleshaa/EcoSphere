import { inject, injectable } from "tsyringe";
import type { IRestaurantService } from "./restaurant.service";
import { IRestaurant } from "./restaurant.model";
import "reflect-metadata";

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
  }): Promise<IRestaurant> {
    return await this.restaurantService.create(
      body.email,
      body.password,
      body.location,
      body.name,
      body.workingHours,
      body.phoneNumber,
      body.avatar,
      body.description
    );
  }
  async getAll(): Promise<IRestaurant[]> {
    return await this.restaurantService.getAll();
  }
  async getById(id: string): Promise<IRestaurant | null> {
    return await this.restaurantService.getById(id);
  }
  async updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant | null> {
    return await this.restaurantService.updateById(id, data);
  }
  async deleteById(id: string): Promise<IRestaurant | null> {
    return await this.restaurantService.deleteById(id);
  }
}
export default RestaurantController;
