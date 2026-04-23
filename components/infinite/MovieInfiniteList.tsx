"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["movies", apiPath],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(`${apiPath}?page=${pageParam}`);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.results && lastPage.results.length > 0
          ? nextPage
          : undefined;
      },
      initialData:
        initialMovies.length > 0
          ? {
              pages: [{ results: initialMovies }],
              pageParams: [1],
            }
          : undefined,
      staleTime: 1000 * 60 * 5, // 5분간 데이터 유지 (캐싱 효과)
    });

  const allMovies = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 list-none">
        {allMovies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>

      {(hasNextPage || isFetchingNextPage || isLoading) && (
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
