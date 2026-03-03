import { getMoviesByGenre, getGenres } from "@/app/lib/movies";
import MovieInfiniteList from "@/components/infinite/MovieInfiniteList";
import { Genre } from "@/(types)/interface";

export const dynamic = "force-static";

export default async function GenreDetailPage({
  params,
}: {
  params: { genreId: string };
}) {
  const [genres, initialData] = await Promise.all([
    getGenres(),
    getMoviesByGenre(params.genreId, 1),
  ]);
  const genre: Genre | undefined = genres.genres.find(
    (g) => g.id === Number(params.genreId),
  );
  const genreName = genre?.name ?? "Unknown";

  return (
    <MovieInfiniteList
      initialMovies={initialData}
      apiPath={`/api/genre/${params.genreId}`}
      title={`🎬 ${genreName} 영화`}
    />
  );
}
