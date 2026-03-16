import { getMoviesByGenre, getGenres } from "@/app/lib/movies";
import MovieInfiniteList from "@/components/infinite/MovieInfiniteList";
import { Genre } from "@/types/interface";
import GenresPage from "../page";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function GenreDetailPage({
  params,
}: {
  params: { genreId: string };
}) {
  const genreId = Number(params.genreId);

  const [genres, initialData] = await Promise.all([
    getGenres(),
    getMoviesByGenre(params.genreId, 1),
  ]);

  const genre: Genre | undefined = genres.genres.find((g) => g.id === genreId);

  if (!genre) {
    notFound();
  }

  return (
    <>
      <GenresPage />
      <MovieInfiniteList
        initialMovies={initialData}
        apiPath={`/api/genre/${params.genreId}`}
        title={`🎬 ${genre.name} 영화`}
      />
    </>
  );
}
