import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { Prisma, Restaurant } from "@/generated/prisma/client";

export interface IRestaurantRepository {
  create(name : string, location : string, rating : number): Promise<Restaurant>;
  getAll(): Promise<Restaurant[]>;
  getById(id: string): Promise<Restaurant | null>;
  updateById(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant | null>;
  deleteById(id: string): Promise<Restaurant | null>;
}

@injectable()
class RestaurantRepository  {
  async create(name : string, location : string, rating : number): Promise<Restaurant> {
    return await prisma.restaurant.create({
      data: { name, location, rating },
    });
  }
  async getAll(): Promise<Restaurant[]> {
    return await prisma.restaurant.findMany();
  }
  async getById(id: string): Promise<Restaurant | null> {
    return await prisma.restaurant.findUnique({
      where: { id },
    });
  }
  async updateById(id: string, data: Prisma.RestaurantUpdateInput): Promise<Restaurant | null> {
    return await prisma.restaurant.update({
      where: { id },
      data,
    });
  }
  async deleteById(id: string): Promise<Restaurant | null> {
    return await prisma.restaurant.delete({
      where: { id },
    });
  }
}

export default RestaurantRepository;