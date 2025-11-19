import { inject, injectable } from "tsyringe";
import type { IAuthRepository } from "./auth.repository";
import {
  comparePassword,
  generateToken,
  hashPassword,
  OMIT,
} from "../../utils/helpers";
import { Gender, User } from "@/generated/prisma/client";
import type { LoginDto, RegisterDto } from "./dto/user.dto";

export interface IAuthService {
  login(loginDto: LoginDto): Promise<{ token: string; user: Omit<User, "password"> } | null>;
  register(
    registerDto: RegisterDto
  ): Promise<{ token: string; user: Omit<User, "password"> } | null>;
  logout(): Promise<void>;
}

@injectable()
class AuthService {
  constructor(
    @inject("IAuthRepository") private authRepository: IAuthRepository
  ) { }

  public async login({
    email,
    password,
  }: LoginDto): Promise<{ token: string; user: User } | null> {
    const user = await this.authRepository.findByEmail(email);
    if (user) {
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        const data = OMIT(user, "password");

        return {
          token,
          user: data as User,
        };
      }
    }
    return null;
  }

  public async register({
    email,
    name,
    password,
    birthDate,
    address,
    avatar,
    gender,
    phoneNumber,
  }: RegisterDto): Promise<{ token: string; user: User } | null> {
    const existingUser = await this.authRepository.findByEmail(email);
    if (!existingUser) {
      const hashed = await hashPassword(password);
      const userGender = Gender[gender as keyof typeof Gender];
      const user = await this.authRepository.register(
        email,
        name,
        hashed,
        birthDate,
        address,
        avatar,
        userGender,
        phoneNumber
      );

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return {
        token,
        user,
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
