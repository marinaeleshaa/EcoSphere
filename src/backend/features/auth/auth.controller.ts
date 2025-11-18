import { inject, injectable } from "tsyringe";
import { User } from "@/generated/prisma/client";
import type { IAuthService } from "./auth.service";
import "reflect-metadata";

@injectable()
class AuthController {
  constructor(
    @inject("IAuthService") private readonly IAuthService: IAuthService
  ) {}

  async LogIn(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "password"> } | null> {
    return await this.IAuthService.login(email, password);
  }

  async Register(body: {
    email: string;
    name: string;
    password: string;
    birthDate: string;
    address: string;
    avatar: string;
    gender: string;
    phoneNumber : string,
  }): Promise<{ token: string; user: Omit<User, "password"> } | null> {
    return await this.IAuthService.register(
      body.email,
      body.name,
      body.password,
      body.birthDate,
      body.address,
      body.avatar,
      body.gender,
      body.phoneNumber,
    );
  }
}

export default AuthController;
