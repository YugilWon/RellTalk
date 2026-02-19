import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_APIKEY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}&api_key=${API_KEY}`,
  );

  const data = await res.json();

  return NextResponse.json(data);
}
