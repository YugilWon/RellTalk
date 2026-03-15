"use client";

import { useEffect, useState } from "react";
import { fetchLikedMovies } from "@/app/lib/likes";
import { getMovie } from "@/app/lib/movies";
import MovieCard from "@/components/movie/MovieCard";
import { Movie } from "@/types/interface";

export default function LikedMovies({ userId }: { userId: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const likedMovieIds = await fetchLikedMovies(userId);

        if (likedMovieIds.length === 0) {
          setMovies([]);
          return;
        }

        const numericIds = likedMovieIds.map(Number).filter((id) => !isNaN(id));

        const movieData = await Promise.all(
          numericIds.map((id) => getMovie(id)),
        );

        setMovies(movieData);
      } catch (error) {
        console.error("좋아요 영화 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [userId]);

  if (loading) return <div>불러오는 중...</div>;

  if (movies.length === 0) return <div>좋아요한 영화가 없습니다.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
