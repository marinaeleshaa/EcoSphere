import { IRegistrationStrategy } from "./registration.service";
import { inject, injectable } from "tsyringe";
import { type IAuthRepository } from "../auth.repository";
import { RecycleAgentDTO, RegisterResponseDTO } from "../dto/user.dto";

@injectable()
export class RecycleAgentRegistration implements IRegistrationStrategy {
  constructor(
    @inject("IAuthRepository") private readonly authRepo: IAuthRepository,
  ) {}

  async register(registerDTO: RecycleAgentDTO): Promise<RegisterResponseDTO> {
    if (!registerDTO) throw new Error("Missing data.");
    const isAgentExists = await this.authRepo.existsByEmail(registerDTO.email);
    if (isAgentExists) throw new Error("Agent already exists.");
    await this.authRepo.saveNewUser(registerDTO);
    return { success: true };
  }
}
