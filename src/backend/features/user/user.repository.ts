import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@/generated/prisma/client";
import { Omit } from "@prisma/client/runtime/library";

export interface IUserRepository {
  getAll(): Promise<Omit<User, "password">[]>;
  getById(id: string): Promise<Omit<User, "password"> | null>;
  updateById(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<Omit<User, "password"> | null>;
  updateFavorites(
    id: string,
    data: string[]
  ): Promise<Omit<User, "password"> | null>;
  deleteById(id: string): Promise<Omit<User, "password"> | null>;
}

@injectable()
class UserRepository {
  async getAll(): Promise<Omit<User, "password">[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        phoneNumber: true,
        address: true,
        avatar: true,
        birthDate: true,
        createdAt: true,
        favorites: true,
        favoritesIds: true,
        points: true,
        role: true,
        gender: true,
        reviews: true,
      },
    });
  }
  async getById(id: string): Promise<Omit<User, "password"> | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        phoneNumber: true,
        address: true,
        avatar: true,
        birthDate: true,
        createdAt: true,
        favorites: true,
        favoritesIds: true,
        points: true,
        role: true,
        gender: true,
        reviews: true,
      },
    });
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        phoneNumber: true,
        address: true,
        avatar: true,
        birthDate: true,
        createdAt: true,
        favoritesIds: true,
        points: true,
        role: true,
        gender: true,
      },
    });
  }

  async updateFavorites(
    id: string,
    data: string[]
  ): Promise<Omit<User, "password"> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { favoritesIds: true },
    });

    if (user) {
      const updatedFavorites = [...user.favoritesIds];

      data.forEach((favId) => {
        const index = updatedFavorites.indexOf(favId);
        if (index > -1) {
          updatedFavorites.splice(index, 1);
        } else {
          updatedFavorites.push(favId);
        }
      });

      return await prisma.user.update({
        where: { id },
        data: { favoritesIds: { set: updatedFavorites } },
        select: {
          id: true,
          email: true,
          name: true,
          password: false,
          phoneNumber: true,
          address: true,
          avatar: true,
          birthDate: true,
          createdAt: true,
          favoritesIds: true,
          points: true,
          role: true,
          gender: true,
        },
      });
    }
    return null;
  }

  async deleteById(id: string): Promise<Omit<User, "password"> | null> {
    return await prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        phoneNumber: true,
        address: true,
        avatar: true,
        birthDate: true,
        createdAt: true,
        favoritesIds: true,
        points: true,
        role: true,
        gender: true,
      },
    });
  }
}

export default UserRepository;
