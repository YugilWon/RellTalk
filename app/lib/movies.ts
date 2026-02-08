import { Movie } from "@/(types)/interface";

const API_KEY = process.env.NEXT_PUBLIC_APIKEY!;

export function extractTrailerId(videos?: { results?: any[] }): string | null {
  if (!videos?.results) return null;

  const trailer = videos.results.find(
    (v: any) =>
      v.site === "YouTube" && v.type === "Trailer" && (v.official ?? true),
  );

  return trailer?.key ?? null;
}

async function fetchMovie(id: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos&language=ko-KR&api_key=${API_KEY}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) throw new Error("Failed to fetch movie detail");

  return res.json();
}

function normalizeMovie(data: any): Movie {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    backdrop_path: data.backdrop_path,
    mainTrailerId: extractTrailerId(data.videos),
  };
}

export async function getMovie(id: string): Promise<Movie> {
  const data = await fetchMovie(Number(id));
  return normalizeMovie(data);
}

export async function getPopularMovies(): Promise<Movie[]> {
  const listRequests = Array.from({ length: 5 }, (_, i) =>
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=${API_KEY}&page=${i + 1}`,
      { next: { revalidate: 60 } },
    ).then((r) => r.json()),
  );

  const listData = await Promise.all(listRequests);
  const movies = listData.flatMap((d) => d.results);

  const detailedMovies = await Promise.all(
    movies.map((movie) => fetchMovie(movie.id).then(normalizeMovie)),
  );

  return Array.from(new Map(detailedMovies.map((m) => [m.id, m])).values());
}
