import MainLayoutClient from "@/components/page/MainLayOutClient";
import MoviePage from "@/components/page/MoviePage";
import GlobalSearch from "@/components/ui/Search";
import YoutubePlayer from "@/components/media/youtube";

export default function Page() {
  return (
    <>
      <div className="sticky top-4 z-50 flex justify-end">
        <GlobalSearch />
      </div>

      <YoutubePlayer />
      <MoviePage />
    </>
  );
}
