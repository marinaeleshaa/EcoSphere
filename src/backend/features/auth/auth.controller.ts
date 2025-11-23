import { inject, injectable } from "tsyringe";
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "./dto/user.dto";
import type { IRegistrationStrategy } from "./registration/registration.service";
import type { ILoginStrategy } from "./login/login.service";

@injectable()
class AuthController {
  constructor(
    @inject("RegistrationService")
    private readonly registrationService: IRegistrationStrategy,
    @inject("LoginService") private readonly loginService: ILoginStrategy
  ) {}

  async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO | null> {
    return await this.loginService.login(loginDto);
  }

  async register(
    registerDto: RegisterRequestDTO
  ): Promise<RegisterResponseDTO | null> {
    return await this.registrationService.register(registerDto);
  }
}

export default AuthController;
