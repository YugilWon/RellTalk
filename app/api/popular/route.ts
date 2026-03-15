import { NextResponse } from "next/server";

const API_KEY = process.env.API_KEY!;

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}&api_key=${API_KEY}`,
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: "Failed to fetch popular movies", details: errorData },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Popular API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
