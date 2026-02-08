import { getPopularMovies } from "@/app/lib/movies";
import { getYoutubeTrailerId } from "../lib/youtube";
import MainLayout from "@/components/page/MainLayOut";
import MoviePage from "@/components/page/MoviePage";
import YoutubePlayer from "@/components/youtube/youtube";
import GlobalSearch from "@/components/ui/Search";
import { Analytics } from "@vercel/analytics/next";

export default async function Page() {
  const movies = await getPopularMovies();

  const randomMovie = movies[Math.floor(Math.random() * movies.length)];

  const trailerId = (await getYoutubeTrailerId(randomMovie.title)) ?? null;

  return (
    <MainLayout>
      <div className="sticky top-4 z-50 flex justify-end">
        <GlobalSearch />
      </div>

      <YoutubePlayer videoId={trailerId} />
      <MoviePage movies={movies} />
    </MainLayout>
  );
}
