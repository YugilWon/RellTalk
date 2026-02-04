import { Suspense } from "react";
import MovieList from "./MovieList";
import MovieListSkeleton from "./MovieListSkeleton";

export default function MoviePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Popular Movies
      </h1>

      <Suspense fallback={<MovieListSkeleton />}>
        <MovieList />
      </Suspense>
    </div>
  );
}
