import { Movie, GenresResponse } from "@/types/interface";
import { getYoutubeTrailerId } from "./youtube";

const API_KEY = process.env.API_KEY!;

interface TMDBVideo {
  key: string;
  site: string;
  type: string;
  official?: boolean;
  genres?: string;
}

interface TMDBMovieListItem {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  genres?: { id: number; name: string }[];
}

interface TMDBMovieDetail extends TMDBMovieListItem {
  videos?: {
    results?: TMDBVideo[];
  };
}

interface TMDBMovieListResponse {
  results: TMDBMovieListItem[];
}

export function extractTrailerId(videos?: {
  results?: TMDBVideo[];
}): string | null {
  if (!videos?.results) return null;

  const trailer =
    videos.results.find(
      (v) =>
        v.site === "YouTube" && v.type === "Trailer" && (v.official ?? true),
    ) ??
    videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return trailer?.key ?? null;
}

function normalizeMovieList(data: TMDBMovieListItem): Movie {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    backdrop_path: data.backdrop_path,
    mainTrailerId: null,
    genres: data.genres?.map((g) => g.name).join(", ") ?? "",
  };
}

export function normalizeMovieDetail(data: TMDBMovieDetail): Movie {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    backdrop_path: data.backdrop_path,
    genres: data.genres?.map((g) => g.name).join(", ") ?? "",
    mainTrailerId: extractTrailerId(data.videos),
  };
}

export async function fetchMovieDetail(id: number): Promise<TMDBMovieDetail> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos&language=ko-KR&api_key=${API_KEY}`,
    {
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch movie detail");

  const data = await res.json();

  return data;
}

export async function getPopularMovies(): Promise<Movie[]> {
  const listRequests = Array.from({ length: 5 }, (_, i) =>
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=${API_KEY}&page=${i + 1}`,
      {
        next: { revalidate: 86400 },
      },
    ).then((r) => r.json() as Promise<TMDBMovieListResponse>),
  );

  const listData = await Promise.all(listRequests);

  const movies = listData.flatMap((d) => d.results).map(normalizeMovieList);

  return Array.from(new Map(movies.map((m) => [m.id, m])).values());
}

export async function getPopularMoviesByPage(page: number): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=${API_KEY}&page=${page}`,
    {
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch popular movies");

  const data = (await res.json()) as TMDBMovieListResponse;

  return data.results.map(normalizeMovieList);
}

export async function getMovie(id: number): Promise<Movie> {
  const data = await fetchMovieDetail(id);
  return normalizeMovieDetail(data);
}

export async function getBestTrailer(
  movie: TMDBMovieDetail,
): Promise<string | null> {
  const tmdbTrailer =
    movie.videos?.results?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ??
    movie.videos?.results?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer",
    );

  if (tmdbTrailer) return tmdbTrailer.key;

  return await getYoutubeTrailerId(movie.title);
}

export async function getGenres(): Promise<GenresResponse> {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=ko-KR&api_key=${API_KEY}`,
    { next: { revalidate: 86400 } },
  );
  return res.json();
}

export async function getMoviesByGenre(
  genreId: string,
  page = 1,
): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&language=ko-KR&api_key=${API_KEY}`,
    { next: { revalidate: 86400 } },
  );

  if (!res.ok) return [];

  const data: TMDBMovieListResponse = await res.json();
  const movies = data.results.map(normalizeMovieList);

  return movies;
}
