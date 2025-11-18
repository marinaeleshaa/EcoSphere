import { inject, injectable } from "tsyringe";
import type { IAuthRepository } from "./auth.repository";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../utils/helpers";
import { Gender, User } from "@/generated/prisma/client";


export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "password"> } | null>;
  register(
    email: string,
    name: string,
    password: string,
    birthDate: string,
    address: string,
    avatar: string,
    gender: string,
    phoneNumber : string,
  ): Promise<{ token: string; user: Omit<User, "password"> } | null>;
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
  ): Promise<{ token: string; user: Omit<User, "password"> } | null> {
    const user = await this.authRepository.findByEmail(email);
    if (user) {
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        const token = generateToken({ id: user.id, email: user.email });

        const { password, ...rest } = user;

        return {
          token,
          user : rest,
        };
      }
    }
    return null;
  }

  public async register(
    email: string,
    name: string,
    password: string,
    birthDate: string,
    address: string,
    avatar: string,
    gender: string,
    phoneNumber : string,
  ): Promise<{ token: string; user: Omit<User, "password"> } | null> {
    const existingUser = await this.authRepository.findByEmail(email);
    if (!existingUser) {
      const hashed = await hashPassword(password);
      const userGender = Gender[gender as keyof typeof Gender]
      const user = await this.authRepository.register(email, name, hashed, birthDate, address, avatar, userGender, phoneNumber);

      const token = generateToken({ id: user.id, email: user.email });
      
      const { password, ...rest } = user;

      return {
        token,
        user : rest,
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
