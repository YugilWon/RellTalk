"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Movie } from "../../(types)/interface";

interface Props {
  movie: Movie;
}

const MovieCard = React.memo(({ movie }: Props) => {
  return (
    <li
      className="
        relative overflow-hidden rounded-lg cursor-pointer
        transition-transform duration-200 ease-out
        hover:scale-105 hover:z-30
        group
      "
    >
      <Link href={`/detail/${movie.id}`} prefetch>
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
            width={500}
            height={281}
            className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-[1px]"
          />
        ) : (
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-white text-sm">
            이미지 없음
          </div>
        )}

        <div
          className="
            absolute inset-0 bg-black/70
            flex flex-col items-center justify-center
            text-center px-4
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
            transition-opacity duration-300
          "
        >
          <h2 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3 leading-snug line-clamp-2">
            {movie.title}
          </h2>

          <span
            className="
              text-xs sm:text-sm text-white/90
              border border-white/40 rounded-full
              px-3 py-1
              transition-all duration-200
              group-hover:bg-white/10
            "
          >
            자세히 보기 →
          </span>
        </div>
      </Link>
    </li>
  );
});

MovieCard.displayName = "MovieCard";
export default MovieCard;
