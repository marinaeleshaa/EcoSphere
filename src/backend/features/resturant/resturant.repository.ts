import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { Menu, Prisma, Restaurant, Reviews, User } from "@/generated/prisma/client";

export interface IRestaurantRepository {
  create(
    location: string,
    rating: number,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string,

  ): Promise<Restaurant>;
  getAll(): Promise<Restaurant[]>;
  getById(id: string): Promise<Restaurant | null>;
  updateById(
    id: string,
    data: Prisma.RestaurantUpdateInput
  ): Promise<Restaurant | null>;
  deleteById(id: string): Promise<Restaurant | null>;
}

@injectable()
class RestaurantRepository {
  async create(
    location: string,
    rating: number,
    name: string,
    workingHours: string,
    phoneNumber: string,
    avatar: string,
    description: string,
  ): Promise<Restaurant> {
    return await prisma.restaurant.create({
      data: {
       location, rating, name, workingHours, phoneNumber, avatar, description
      },
    });
  }
  async getAll(): Promise<Restaurant[]> {
    return await prisma.restaurant.findMany({
      include: { reviews: true },
    });
  }
  async getById(id: string): Promise<Restaurant | null> {
    return await prisma.restaurant.findUnique({
      where: { id },
      include: { reviews: true },
    });
  }
  async updateById(
    id: string,
    data: Prisma.RestaurantUpdateInput
  ): Promise<Restaurant | null> {
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
