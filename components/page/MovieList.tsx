"use client";
import MovieCard from "./MovieCard";
import { Movie } from "@/(types)/interface";

export default function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <ul
      className="
     grid grid-cols-2
     sm:grid-cols-3
     md:grid-cols-4
     lg:grid-cols-5
     gap-3 sm:gap-4
    "
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
