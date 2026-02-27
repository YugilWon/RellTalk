import TMDBPopular from "../infinite/MovieInfiniteList";
import { getPopularMoviesByPage } from "@/app/lib/movies";

export default async function TMDBSSR() {
  const initialMovies = await getPopularMoviesByPage(1);

  return (
    <TMDBPopular
      initialMovies={initialMovies}
      apiPath="/api/popular"
      title="🎬 TMDB 인기 영화"
    />
  );
}
