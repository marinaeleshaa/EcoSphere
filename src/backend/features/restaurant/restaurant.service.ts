import { inject, injectable } from "tsyringe";
import type { IRestaurantRepository } from "./restaurant.repository";
import { IRestaurant } from "./restaurant.model";

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
  getById(id: string): Promise<IRestaurant | null>;
  updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant | null>;
  deleteById(id: string): Promise<IRestaurant | null>;
}

@injectable()
class RestaurantService {
  constructor(
    @inject("IRestaurantRepository")
    private readonly restaurantRepository: IRestaurantRepository
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
    return await this.restaurantRepository.create(
      email,
      password,
      location,
      name,
      workingHours,
      phoneNumber,
      avatar,
      description
    );
  }
  async getAll(): Promise<IRestaurant[]> {
    return await this.restaurantRepository.getAll();
  }
  async getById(id: string): Promise<IRestaurant | null> {
    return await this.restaurantRepository.getById(id);
  }
  async updateById(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant | null> {
    return await this.restaurantRepository.updateById(id, data);
  }
  async deleteById(id: string): Promise<IRestaurant | null> {
    return await this.restaurantRepository.deleteById(id);
  }
}
export default RestaurantService;
