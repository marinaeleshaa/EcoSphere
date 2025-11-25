import { inject, injectable } from "tsyringe";
import type {
  LoginRequestDTO,
  LoginResponse,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "./dto/user.dto";
import type { IRegistrationStrategy } from "./registration/registration.service";
import { LoginService } from "./login/users.login.service";

@injectable()
class AuthController {
  constructor(
    @inject("RegistrationService")
    private readonly registrationService: IRegistrationStrategy,
    @inject("LoginService") private readonly loginService: LoginService
  ) {}

  async login(loginDto: LoginRequestDTO): Promise<LoginResponse> {
    return await this.loginService.login(loginDto);
  }

  async register(
    registerDto: RegisterRequestDTO
  ): Promise<RegisterResponseDTO> {
    return await this.registrationService.register(registerDto);
  }
}

export default AuthController;
