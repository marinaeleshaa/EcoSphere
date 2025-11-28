import { inject, injectable } from "tsyringe";
import type {
  LoginRequestDTO,
  LoginResponse,
  OAuthUserDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "./dto/user.dto";
import type { IRegistrationStrategy } from "./registration/registration.service";
import { LoginService } from "./login/users.login.service";

export interface IAuthController {
  loginWithCredentials(loginDto: LoginRequestDTO): Promise<LoginResponse>;
  LoginWithGoogle(user: OAuthUserDTO, googleId: string): Promise<boolean>;
  register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
}

@injectable()
class AuthController implements IAuthController {
  constructor(
    @inject("RegistrationService")
    private readonly registrationService: IRegistrationStrategy,
    @inject("LoginService") private readonly loginService: LoginService,
  ) {}

  async loginWithCredentials(
    loginDto: LoginRequestDTO,
  ): Promise<LoginResponse> {
    if (!loginDto.email || !loginDto.password) {
      throw new Error("Email and password are required");
    }
    return await this.loginService.login(loginDto);
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
