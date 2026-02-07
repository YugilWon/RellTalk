import { Movie } from "@/(types)/interface";

const API_KEY = process.env.NEXT_PUBLIC_APIKEY!;

export async function getPopularMovies(): Promise<Movie[]> {
  const requests = Array.from({ length: 5 }, (_, i) =>
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko&api_key=${API_KEY}&page=${
        i + 1
      }`,
      {
        next: { revalidate: 60 },
      },
    ),
  );

  const responses = await Promise.all(requests);
  const data = await Promise.all(responses.map((r) => r.json()));

  const movies: Movie[] = data.flatMap((d) => d.results);

  return Array.from(new Map(movies.map((movie) => [movie.id, movie])).values());
}
