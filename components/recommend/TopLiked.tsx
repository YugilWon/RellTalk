"use client";

import { useEffect, useState } from "react";
import { getLikedMovie } from "@/app/lib/recommend";
import { getMovie } from "@/app/lib/movies";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/(types)/interface";
import NoImage from "@/public/assets/no_image.png";

export default function TopLiked() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieIds = await getLikedMovie();
        if (movieIds.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        const moviesData = await Promise.all(
          movieIds.map((id) => getMovie(id)),
        );
        setMovies(moviesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">
          🔥 RillTalk 유저들이 좋아하는 영화
        </h2>
        <p className="text-gray-400">로딩중...</p>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">
          🔥 RillTalk 유저들이 좋아하는 영화
        </h2>
        <p className="text-gray-400">아직 좋아요가 없습니다 😢</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-white">
        🔥 RillTalk 유저들이 좋아하는 영화
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/detail/${movie.id}`} className="group">
            <div className="relative overflow-hidden rounded-xl cursor-pointer">
              <Image
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                    : NoImage
                }
                alt={movie.title}
                width={300}
                height={450}
                className="transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-semibold text-center px-4">
                  {movie.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
