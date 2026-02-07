"use client";
import MovieCard from "./MovieCard";
import { Movie } from "@/(types)/interface";

export default function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
