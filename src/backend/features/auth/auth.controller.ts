import { inject, injectable } from "tsyringe";
import type { IUser } from "../user/user.model";
import type { IAuthService } from "./auth.service";
import "reflect-metadata";

@injectable()
class AuthController {
  constructor(
    @inject("IAuthService") private readonly IAuthService: IAuthService
  ) {}

  async LogIn(email: string, password: string): Promise<string> {
    return await this.IAuthService.login(email, password);
  }

  async Register(body: {
    email: string;
    name: string;
    password: string;
  }): Promise<IUser | null> {
    return await this.IAuthService.register(body.email, body.name,body.password);
  }
}

export default AuthController;
