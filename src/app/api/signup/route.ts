import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/backend/config/container";
import AuthController from "@/backend/features/auth/auth.controller";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const controller = rootContainer.resolve(AuthController);

  try {
    const result = await controller.Register(body);

    if (!result) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
