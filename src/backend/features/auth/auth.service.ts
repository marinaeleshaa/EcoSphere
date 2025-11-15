import { inject, injectable } from "tsyringe";
import type { IUser } from "../user/user.model";
import type { IAuthRepository } from "./auth.repository";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../utils/helpers";

export interface IAuthService {
  login(email: string, password: string): Promise<string>;
  register(email: string, name: string, password: string): Promise<IUser>;
  logout(): Promise<void>;
}

@injectable()
class AuthService {
  constructor(
    @inject("IAuthRepository") private authRepository: IAuthRepository
  ) {}

  public async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<IUser, "passwordHash"> } | null> {
    const user = await this.authRepository.findByEmail(email);
    if (user) {
      const isMatch = await comparePassword(password, user.passwordHash);
      if (isMatch) {
        const token = generateToken({ id: user._id, email: user.email });

        return {
          token,
          user: { _id: user._id, email: user.email, name: user.name },
        };
      }
    }
    return null;
  }

  public async register(
    email: string,
    name: string,
    password: string
  ): Promise<{ token: string; user: Omit<IUser, "passwordHash"> } | null> {
    const existingUser = await this.authRepository.findByEmail(email);
    if (!existingUser) {
      const hashed = await hashPassword(password);
      const user =  await this.authRepository.register(email, name, hashed);

      const token = generateToken({ id: user._id, email: user.email });

        return {
          token,
          user: { _id: user._id, email: user.email, name: user.name },
        };
    }
    return null;
  }
  public async me(): Promise<void> {
    return;
  }
  public async logout(): Promise<void> {
    return;
  }

}

export default AuthService;
