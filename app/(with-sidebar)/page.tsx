import { getPopularMovies } from "../lib/movies";
import { getYoutubeTrailerId } from "../lib/youtube";
import MoviePage from "@/components/movie/MoviePage";
import YoutubePlayer from "@/components/youtube/youtube";
import GlobalSearch from "@/components/ui/Search";
import Notification from "@/components/notification/Notification";

export default async function Page() {
  const movies = await getPopularMovies();

  const randomMovie = movies[Math.floor(Math.random() * movies.length)];

  console.log("movies:", movies.length);
  console.log("randomMovie:", randomMovie.title);
  console.log("mainTrailerId:", randomMovie.mainTrailerId);

  const trailerId =
    randomMovie.mainTrailerId ?? (await getYoutubeTrailerId(randomMovie.title));

  console.log("FINAL trailerId:", trailerId);

  return (
    <>
      <div className="sticky top-4 z-50 flex justify-end items-center gap-3 mb-4 px-4">
        <Notification />
        <GlobalSearch />
      </div>

      <section className="px-4">
        <YoutubePlayer videoId={trailerId} />
      </section>

      <section className="px-4 mt-6">
        <MoviePage movies={movies} />
      </section>
    </>
  );
}
