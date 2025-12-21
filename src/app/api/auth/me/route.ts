import { getCurrentUser } from "@/backend/utils/authHelper";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await getCurrentUser();
  if (user) return NextResponse.json({ authenticated: true }, { status: 200 });
  return NextResponse.json({ authenticated: true }, {status: 401})
};
