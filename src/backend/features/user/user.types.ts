import { IUser, UserRole } from "./user.model";

export type DashboardUsers = Record<UserRole, IUser[]>;

export interface PagedData<T> {
  data: T[];
  meta: PagingMeta;
}

export interface PagingMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
