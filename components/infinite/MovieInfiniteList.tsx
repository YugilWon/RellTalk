"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/(types)/interface";
import NoImage from "@/assets/NoImage.png";

interface MovieistProps {
  initialMovies?: Movie[];
  apiPath: string;
  title: string;
}

export default function MovieInfiniteList({
  initialMovies = [],
  apiPath,
  title,
}: MovieistProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(initialMovies.length ? 2 : 1);
  const [more, setMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const getImageUrl = (movie: Movie) => {
    if (imageError[movie.id]) {
      return NoImage;
    }

    if (movie.backdrop_path) {
      return `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    }

    return NoImage;
  };
  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(`${apiPath}?page=${page}`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setMore(false);
        return;
      }

      setMovies((prev) => {
        const newMovies = data.results.filter(
          (movie: Movie) => !prev.some((p) => p.id === movie.id),
        );
        return [...prev, ...newMovies];
      });
    };

    fetchMovies();
  }, [page, apiPath]);

  useEffect(() => {
    if (!more) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [more]);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-6
          justify-items-center
        "
      >
        {movies.map((movie) => (
          <Link key={movie.id} href={`/detail/${movie.id}`} className="group">
            <div className="relative overflow-hidden rounded-xl cursor-pointer">
              <Image
                src={getImageUrl(movie)}
                alt={movie.title}
                width={300}
                height={450}
                onError={() =>
                  setImageError((prev) => ({
                    ...prev,
                    [movie.id]: true,
                  }))
                }
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

      {more && (
        <div
          ref={observerRef}
          className="h-20 flex items-center justify-center"
        >
          <p className="text-gray-400">로딩중...</p>
        </div>
      )}
    </section>
  );
}
