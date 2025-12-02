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

export const unauthorized = (message: string) => {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
};

export const serverError = (message?: string) => {
  return NextResponse.json(
    { success: false, error: message ?? "Internal Server Error" },
    { status: 500 }
  );
};
