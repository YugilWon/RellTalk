import Image from "next/image";
import Comments from "@/components/comment/Comment";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
}

async function getMovie(id: string): Promise<Movie> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_APIKEY}&language=ko`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

async function getTrailerId(title: string): Promise<string | null> {
  const baseUrl = process.env.APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not defined");
  }

  const res = await fetch(
    `${baseUrl}/api/youtubeMovie?title=${encodeURIComponent(title)}`,
    { cache: "no-store" },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.videoId ?? null;
}

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);

  // 예고편 실패해도 페이지는 정상 렌더
  const trailerId = await getTrailerId(movie.title).catch(() => null);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* 🎬 HERO */}
      <div className="relative h-[420px]">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {movie.title}
          </h1>
          <p className="text-gray-300 max-w-3xl line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* 🎞 예고편 */}
        {trailerId && (
          <section>
            <h2 className="text-2xl font-bold mb-6">예고편</h2>
            <div className="relative aspect-video rounded-xl overflow-hidden">
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
          <h2 className="text-2xl font-bold mb-4">댓글</h2>
          <Comments movieId={params.id} />
        </section>
      </div>
    </div>
  );
}
