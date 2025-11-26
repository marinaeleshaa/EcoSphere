import { NextResponse } from "next/server";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const ok = <T>(data: T) => {
  return NextResponse.json({ success: true, data }, { status: 200 });
};

export const created = <T>(data: T) => {
  return NextResponse.json({ success: true, data }, { status: 201 });
};

export const badRequest = (message: string) => {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
};

export const notFound = (message: string) => {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
};

export const serverError = (message: string) => {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
};

/* optional improvement simpler and more readable
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
utils/http-response.ts
export const ok = <T>(data: T) =>
  Response.json({ success: true, data }, { status: 200 });

export const created = <T>(data: T) =>
  Response.json({ success: true, data }, { status: 201 });

export const badRequest = (message: string) =>
  Response.json({ success: false, error: message }, { status: 400 });

and than we can use it like 
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name) return badRequest("Missing name");
  const user = await userService.create(body);
  return ok(user);
}
  */
