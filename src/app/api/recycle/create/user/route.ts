import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    firstName,
    lastName,
    email,
    phone,
    city,
    neighborhood,
    street,
    building,
    floor,
    apartment,
  } = body;

  // Validate the input data
  if (!name || !email) {
    return new Response("Invalid input data", { status: 400 });
  }

  return new Response(JSON.stringify(user), { status: 201 });
};
