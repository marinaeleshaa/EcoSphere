import { inject, injectable } from "tsyringe";
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  OAuthUserDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "./dto/user.dto";
import type { IRegistrationStrategy } from "./registration/registration.service";
import { LoginService } from "./login/users.login.service";
import { ILoginFactory } from "./login/login.strategy.factory";

export interface IAuthController {
  loginWithCredentials(loginDto: LoginRequestDTO): Promise<LoginResponseDTO>;
  LoginWithGoogle(user: OAuthUserDTO, googleId: string): Promise<boolean>;
  register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
}

@injectable()
class AuthController implements IAuthController {
  constructor(
    @inject("RegistrationService")
    private readonly registrationService: IRegistrationStrategy,
    @inject("LoginService") private readonly loginService: LoginService,
    @inject("LoginFactory") private readonly loginFactory: any
  ) {}

  async loginWithCredentials(
    loginDto: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    if (!loginDto.email || !loginDto.password) {
      throw new Error("Email and password are required");
    }
    // Determine user type based on role or try both?
    // The login strategies expect the user to exist.
    // We can try user strategy first, then shop?
    // Or we can pass a type if we know it.
    // LoginRequestDTO doesn't have type.
    
    // The previous implementation tried shop then user.
    // We can do the same logic here or let the factory handle it?
    // The factory expects a type string.
    
    // Workaround: Try to find user to know the type, or try both strategies.
    // But strategies throw error if not found.
    
    // Let's use the LoginService to find the user/shop first (it has findByEmail logic),
    // then use the appropriate strategy?
    // Or just use the strategies directly.
    
    // Better: Update LoginRequestDTO to include type? No, user doesn't send it usually.
    // But the frontend sends `loginType`!
    
    // Let's check LoginRequestDTO definition.
    // It has email and password.
    
    // The frontend sends `loginType` in the body!
    // But LoginRequestDTO doesn't have it.
    
    // I should cast loginDto to any to access loginType if it exists.
    const type = (loginDto as any).loginType || "customer";
    const strategy = this.loginFactory.getStrategy(type);
    return await strategy.login(loginDto);
  }

  async LoginWithGoogle(user: OAuthUserDTO): Promise<boolean> {
    const savedUser = await this.loginService.findByEmail(
      user.email,
      user.provider!
    );

    if (!savedUser) {
      await this.registrationService.register(user);
    }
    return true;
  }

  async register(
    registerDto: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return await this.registrationService.register(registerDto);
  }
}

export default AuthController;
