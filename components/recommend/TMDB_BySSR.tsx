import TMDBPopular from "./TMDBPopular"; // 기존 CSR 컴포넌트
import { getPopularMoviesByPage } from "@/app/lib/movies";

export default async function TMDBSSR() {
  const initialMovies = await getPopularMoviesByPage(1);

  return <TMDBPopular initialMovies={initialMovies} />;
}
