import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({}, { status: 204 });

  res.cookies.set("accessToken", "", {
    maxAge: 0,
  });

  return res;
}
