// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json({
      isAuthenticated: true,
      user: decoded,
    });
  } catch {
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }
}

export async function POST() {
  cookies().set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({ success: true });
}
