import { rootContainer } from "@/src/backend/config/container";
import UserController from "@/src/backend/features/user/user.controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const controller = rootContainer.resolve(UserController);
	const result = await controller.getAll();
	return NextResponse.json({ message: "hello after db connection", result });
};
