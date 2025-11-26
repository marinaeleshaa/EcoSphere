import { inject, injectable } from "tsyringe";
import type { IAuthRepository } from "./auth.repository";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../utils/helpers";
import type {
  LoginRequestDTO,
  RegisterRequestDTO,
  LoginResponseDTO,
  RegisterResponseDTO,
} from "./dto/user.dto";
import { Gender, IUser } from "../user/user.model";

export interface IAuthService {
  login(
    loginDto: LoginRequestDTO
  ): Promise<{ token: string; user: IUser } | null>;
  register(
    registerDto: RegisterRequestDTO
  ): Promise<{ token: string; user: IUser } | null>;
  logout(): Promise<void>;
}

@injectable()
class AuthService {
  constructor(
    @inject("IAuthRepository") private readonly authRepository: IAuthRepository
  ) {}

  public async login({
    email,
    password,
  }: LoginRequestDTO): Promise<LoginResponseDTO | null> {
    const user = await this.authRepository.findUserByEmail(email);
    if (user) {
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        const token = generateToken({
          _id: user._id,
          email: user.email,
          lastName: user.lastName,
          role: user.role,
        });

        return {
          token,
          user,
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
  }: RegisterRequestDTO): Promise<RegisterResponseDTO | null> {
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (!existingUser) {
      const user = await this.authRepository.register(
        email,
        name,
        password,
        birthDate,
        address,
        avatar,
        gender.toLowerCase() as Gender,
        phoneNumber
      );

      const token = generateToken({
        _id: user._id,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });

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
