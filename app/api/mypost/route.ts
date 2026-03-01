import { NextResponse } from "next/server";
import { getMyPosts } from "@/app/lib/post";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);

  if (!userId) {
    return NextResponse.json([], { status: 400 });
  }

  const result = await getMyPosts(userId, page, limit);

  return NextResponse.json(result);
}
