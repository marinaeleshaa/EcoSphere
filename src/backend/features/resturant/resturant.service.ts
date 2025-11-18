import { inject, injectable } from "tsyringe";
import type { IRestaurantRepository } from "./resturant.repository";
import { Prisma, Restaurant } from "@/generated/prisma/client";

export interface IRestaurantService {
    create(name : string, location : string, rating : number): Promise<Restaurant>;
    getAll(): Promise<Restaurant[]>;
    getById(id: string): Promise<Restaurant | null>;
    updateById(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant | null>;
    deleteById(id: string): Promise<Restaurant | null>;
}

@injectable()
class RestaurantService {
    constructor(
        @inject("IRestaurantRepository") private readonly restaurantRepository: IRestaurantRepository
    ) {}
    async create(name : string, location : string, rating : number): Promise<Restaurant> {
        return await this.restaurantRepository.create(name, location, rating);
    }
    async getAll(): Promise<Restaurant[]> {
        return await this.restaurantRepository.getAll();
    }
    async getById(id: string): Promise<Restaurant | null> {
        return await this.restaurantRepository.getById(id);
    }
    async updateById(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant | null> {
        return await this.restaurantRepository.updateById(id, data);
    }
    async deleteById(id: string): Promise<Restaurant | null> {
        return await this.restaurantRepository.deleteById(id);
    }
}
export default RestaurantService;