import { Suspense } from "react";
import MovieList from "./MovieList";
import MovieListSkeleton from "./MovieListSkeleton";

export default function MoviePage() {
  return (
    <>
      <Suspense fallback={<MovieListSkeleton />}>
        <MovieList />
      </Suspense>
    </>
  );
}
