import { IUser, UserRole } from "./user.model";

export type DashboardUsers = Record<UserRole, IUser[]>;
