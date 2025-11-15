import { rootContainer } from "@/src/config/container";
import UserController from "@/src/features/user.controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const controller = rootContainer.resolve(UserController);
	const result = await controller.getAll();
	return NextResponse.json({ message: "hello after db connection", result });
};
