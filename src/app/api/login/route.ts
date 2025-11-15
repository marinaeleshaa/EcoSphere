import { NextRequest, NextResponse } from "next/server";
import { rootContainer } from "@/src/backend/config/container";
import AuthController from "@/src/backend/features/auth/auth.controller";

export const POST = async (request: NextRequest) => {
  const {email, password} = await request.json();
  const controller = rootContainer.resolve(AuthController);

  try {
    const result = await controller.LogIn(email, password);

    if (!result) {
      return NextResponse.json(
        {
          message: "Either email or password is incorrect",
        },
        { status: 401 }
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
