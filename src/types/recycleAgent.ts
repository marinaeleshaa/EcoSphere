import { UserType } from "@/backend/utils/mailTemplates";
import { IUser } from "@/backend/features/user/user.model";

export type AgentType = "independent" | "organizational";

export interface RecycleAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  birthDate?: string;
  role: UserType;
  agentType: AgentType;
  isActive: boolean;
}

export interface NewRecycleAgentFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  role: UserType;
  agentType: AgentType;
  password: string;
}

export const mapUserToAgent = (users: IUser[]): RecycleAgent[] =>
  users.map((user) => ({
    id: `${user._id}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    birthDate: user.birthDate,
    role: user.role as UserType,
    agentType: "independent",
    isActive: user.isActive,
  }));
