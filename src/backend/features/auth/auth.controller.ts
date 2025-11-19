import { inject, injectable } from "tsyringe";
import { User } from "@/generated/prisma/client";
import type { IAuthService } from "./auth.service";
import type { LoginDto, RegisterDto } from "./dto/user.dto";
import "reflect-metadata";

@injectable()
class AuthController {
  constructor(
    @inject("IAuthService") private readonly IAuthService: IAuthService
  ) { }

  async login(
    loginDto: LoginDto
  ): Promise<{ token: string; user: Omit<User, "password"> } | null> {
    return await this.IAuthService.login(loginDto);
  }

  async register(
    registerDto: RegisterDto
  ): Promise<{ token: string; user: Omit<User, "password"> } | null> {
    return await this.IAuthService.register(registerDto);
  }
}

export default AuthController;
