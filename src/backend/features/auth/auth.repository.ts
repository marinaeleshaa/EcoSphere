import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { User } from "@/generated/prisma/client";

export interface IAuthRepository {
  register(email: string, name: string, password: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  createUser(email: string, name: string, password: string): Promise<User>;
  me(): Promise<User[]>;
}

@injectable()
class AuthRepository {
  async register(
    email: string,
    name: string,
    password: string
  ): Promise<User | null> {
    return await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}

export default AuthRepository;
