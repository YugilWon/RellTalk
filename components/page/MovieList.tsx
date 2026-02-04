// components/page/MovieList.tsx
import MovieCard from "./MovieCard";
import { Movie } from "@/(types)/interface";

const API_KEY = process.env.NEXT_PUBLIC_APIKEY;

export default async function MovieList() {
  const requests = Array.from({ length: 5 }, (_, i) =>
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko&api_key=${API_KEY}&page=${
        i + 1
      }`,
      {
        next: { revalidate: 60 },
      },
    ),
  );

  const responses = await Promise.all(requests);
  const data = await Promise.all(responses.map((r) => r.json()));

  // 🔥 모든 페이지 결과 합치기
  const movies: Movie[] = data.flatMap((d) => d.results);

  // 🔥 중복 제거 (movie.id 기준)
  const uniqueMovies: Movie[] = Array.from(
    new Map(movies.map((movie) => [movie.id, movie])).values(),
  );

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {uniqueMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
