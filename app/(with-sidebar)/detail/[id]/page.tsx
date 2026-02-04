"use client"; // ✅ 클라이언트에서 렌더링

import Image from "next/image";
import Comments from "@/components/comment/Comment";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
}

interface DetailPageProps {
  params: { id: string };
}

export default function DetailPage({ params }: DetailPageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerId, setTrailerId] = useState<string | null>(null);

  useEffect(() => {
    // 영화 정보 가져오기
    fetch(
      `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_APIKEY}&language=ko`,
    )
      .then((res) => res.json())
      .then(setMovie)
      .catch(() => null);
  }, [params.id]);

  useEffect(() => {
    if (!movie) return;

    // 예고편 가져오기
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/youtubeMovie?title=${encodeURIComponent(movie.title)}`,
    )
      .then((res) => res.json())
      .then((data) => setTrailerId(data.videoId ?? null))
      .catch(() => null);
  }, [movie]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* 🎬 HERO */}
      <div className="relative h-[300px] sm:h-[420px] md:h-[500px] lg:h-[600px]">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4">
            {movie.title}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-3xl line-clamp-4 sm:line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* 🎞 예고편 */}
        {trailerId && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              예고편
            </h2>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${trailerId}`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* 💬 댓글 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">댓글</h2>
          <Comments movieId={params.id} />
        </section>
      </div>
    </div>
  );
}
