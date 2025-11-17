import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@/generated/prisma/client";


export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  updateById(id: string, data: Prisma.UserUpdateInput): Promise<User | null>;
  deleteById(id: string): Promise<User | null>;
}

@injectable()
class UserRepository {
  async getAll(): Promise<User[]> {
    return await prisma.user.findMany();
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
      },
    });
  }

  async updateById(id: string, data: Prisma.UserUpdateInput): Promise<Omit<User, "password"> | null> {
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
      },
    });
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
      },
    });
  }

}

export default UserRepository;
