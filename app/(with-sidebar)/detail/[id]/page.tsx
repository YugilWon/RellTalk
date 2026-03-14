import Image from "next/image";
import Comments from "@/components/comment/Comment";
import { getBestTrailer } from "@/app/lib/movies";
import OverView from "@/components/detail/OverView";
import { fetchMovieDetail, normalizeMovieDetail } from "@/app/lib/movies";

import MovieLike from "@/components/like/MovieLike";

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tmdbMovie = await fetchMovieDetail(Number(params.id));
  const trailerId = await getBestTrailer(tmdbMovie);
  const movie = normalizeMovieDetail(tmdbMovie);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="relative h-[300px] sm:h-[420px] md:h-[500px] lg:h-[600px]">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-300 text-sm sm:text-base">
              이미지 없음
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4">
            {movie.title}
          </h1>
          <MovieLike movieId={params.id} />
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {movie.genres}
          </h2>
          <OverView text={movie.overview} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {trailerId ? (
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
        ) : (
          <p className="text-gray-400 italic">예고편이 없습니다.</p>
        )}

        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">댓글</h2>
          <Comments targetId={params.id} targetType="movie" />
        </section>
      </div>
    </div>
  );
}
