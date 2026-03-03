import { getPopularMovies } from "../lib/movies";
import { getYoutubeTrailerId } from "../lib/youtube";
import MoviePage from "@/components/movie/MoviePage";
import YoutubePlayer from "@/components/youtube/youtube";
import GlobalSearch from "@/components/ui/Search";
import AuthToastWrapper from "@/components/common/AuthToastWrapper";

export default async function Page() {
  const movies = await getPopularMovies();

  const randomMovie = movies[Math.floor(Math.random() * movies.length)];

  const trailerId =
    randomMovie.mainTrailerId ?? (await getYoutubeTrailerId(randomMovie.title));

  return (
    <>
      <div className="sticky top-4 z-50 flex justify-end mb-4">
        <GlobalSearch />
      </div>
      <AuthToastWrapper />
      <section className="px-4">
        <YoutubePlayer videoId={trailerId} />
      </section>

      <section className="px-4 mt-6">
        <MoviePage movies={movies} />
      </section>
    </>
  );
}
