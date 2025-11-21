export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export enum UserRole {
  CUSTOMER = "customer",
  Organizer = "organizer",
  ADMIN = "admin",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}
