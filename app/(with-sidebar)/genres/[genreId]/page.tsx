import { getMoviesByGenre, getGenres } from "@/app/lib/movies";
import MovieInfiniteList from "@/components/infinite/MovieInfiniteList";
import { Genre } from "@/(types)/interface";

export default async function GenreDetailPage({
  params,
}: {
  params: { genreId: string };
}) {
  const genres = await getGenres();

  const genre: Genre | undefined = genres.genres.find(
    (g) => g.id === Number(params.genreId),
  );
  const genreName = genre?.name ?? "Unknown";

  const initialData = await getMoviesByGenre(params.genreId, 1);

  return (
    <MovieInfiniteList
      initialMovies={initialData}
      apiPath={`/api/genre/${params.genreId}`}
      title={`🎬 ${genreName} 영화`}
    />
  );
}
