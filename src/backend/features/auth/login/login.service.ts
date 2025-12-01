import { LoginRequestDTO, LoginResponseDTO } from "../dto/user.dto";

export interface ILoginStrategy {
  login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
}
