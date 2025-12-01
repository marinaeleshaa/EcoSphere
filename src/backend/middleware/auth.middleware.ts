import { NextResponse } from "next/server";
import { verifyJwt } from "../utils/helpers";
import { TokenPayload } from "../features/auth/dto/user.dto";

export async function verifyToken(req: Request): Promise<TokenPayload | NextResponse> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token) as TokenPayload;

    return decoded;
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }
}
