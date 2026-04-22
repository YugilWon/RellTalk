"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Movie } from "@/types/interface";
import MovieCard from "../movie/MovieCard";
import MovieCardSkeleton from "../movie/MovieCardSkeleton";

interface MovieInfiniteListProps {
  initialMovies?: Movie[];
  apiPath: string;
  title: string;
}

export default function MovieInfiniteList({
  initialMovies = [],
  apiPath,
  title,
}: MovieInfiniteListProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(initialMovies.length ? 2 : 1);
  const [more, setMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleImageError = useCallback((id: number) => {
    setImageError((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  }, []);

  useEffect(() => {
    if (page === 1 && initialMovies.length > 0) return;
    if (!more) return;

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
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
      } catch (err) {
        console.error("영화 데이터 fetch 실패:", err);
        setMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page, apiPath, initialMovies, more]);

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

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 list-none">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            imageError={imageError[movie.id]}
            setImageError={handleImageError}
          />
        ))}
      </ul>

      {(more || isLoading) && (
        <div ref={observerRef} className="mt-6">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 list-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
