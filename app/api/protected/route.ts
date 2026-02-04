import { NextResponse } from "next/server";
import { authenticateToken } from "@/app/lib/auth";

export async function GET() {
  authenticateToken();

  return NextResponse.json({
    message: "This is protected content",
  });
}
