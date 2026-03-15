import { Movie } from "@/types/interface";
import { Suspense } from "react";
import MovieList from "./MovieList";
import MovieListSkeleton from "./MovieListSkeleton";

export default function MoviePage({ movies }: { movies: Movie[] }) {
  return (
    <Suspense fallback={<MovieListSkeleton />}>
      <MovieList movies={movies} />
    </Suspense>
  );
}
