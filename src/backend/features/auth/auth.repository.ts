import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { Gender, User } from "@/generated/prisma/client";

export interface IAuthRepository {
  register(
    email: string,
    name: string,
    password: string,
    birthDate: string,
    address: string,
    avatar: string,
    gender: Gender,
    phoneNumber: string
  ): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  me(): Promise<User[]>;
}

@injectable()
class AuthRepository {
  async register(
    email: string,
    name: string,
    password: string,
    birthDate: string,
    address: string,
    avatar: string,
    gender: Gender,
    phoneNumber: string
  ): Promise<User | null> {
    return (await prisma.user.create({
      data: {
        email,
        name,
        password,
        birthDate,
        address: address || null,
        avatar: avatar || null,
        gender,
        phoneNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        address: true,
        avatar: true,
        birthDate: true,
        createdAt: true,
        points: true,
        role: true,
        gender: true,
      },
    })) as User;
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
