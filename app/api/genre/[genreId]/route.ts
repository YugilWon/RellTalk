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

    return NextResponse.json({ results: movies });
  } catch (err) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
