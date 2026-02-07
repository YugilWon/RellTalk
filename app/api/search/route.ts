export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_APIKEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { message: "검색어가 없습니다." },
        { status: 400 },
      );
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return NextResponse.json(
        { message: "유효한 검색어를 입력하세요." },
        { status: 400 },
      );
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko&query=${encodeURIComponent(
        trimmedQuery,
      )}&include_adult=false`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "TMDB 검색 실패" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json({
      results: data.results ?? [],
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}
