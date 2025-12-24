export type AgentType = "independent" | "organizational";

export interface RecycleAgent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  birthDate?: string;
  type: AgentType;
  isActive: boolean;
}

export interface NewRecycleAgentFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  type: AgentType;
  password: string;
}
