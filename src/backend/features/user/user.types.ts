import { IUser } from "./user.model";

export type DashboardData = {
	organizer: IUser[];
	recycleMan: IUser[];
	admin: IUser[];
};
