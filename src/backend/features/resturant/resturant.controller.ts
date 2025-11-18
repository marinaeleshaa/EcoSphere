import { inject, injectable } from "tsyringe";
import type { IRestaurantService } from "./resturant.service";
import { Prisma, Restaurant } from "@/generated/prisma/client";
import "reflect-metadata";

@injectable()
class RestaurantController {
    constructor(
        @inject("IRestaurantService") private readonly restaurantService: IRestaurantService
    ) {}
    async create(name : string, location : string, rating : number): Promise<Restaurant> {
        return await this.restaurantService.create(name, location, rating);
    }
    async getAll(): Promise<Restaurant[]> {
        return await this.restaurantService.getAll();
    }
    async getById(id: string): Promise<Restaurant | null> {
        return await this.restaurantService.getById(id);
    }
    async updateById(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant | null> {
        return await this.restaurantService.updateById(id, data);
    }
    async deleteById(id: string): Promise<Restaurant | null> {
        return await this.restaurantService.deleteById(id);
    }
}
export default RestaurantController;