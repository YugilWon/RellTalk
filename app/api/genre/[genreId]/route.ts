import { NextResponse } from "next/server";
import { getMoviesByGenre } from "@/app/lib/movies";

export async function GET(
  req: Request,
  { params }: { params: { genreId: string } },
) {
  const { genreId } = params;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);

  try {
    const movies = await getMoviesByGenre(genreId, page);

    const response = NextResponse.json({ results: movies });

    // 브라우저 캐싱 추가 (1시간 동안 공유 캐시 유지)
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=59",
    );

    return response;
  } catch (err) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
