import MainLayoutClient from "@/components/page/MainLayOutClient";
import YoutubePlayer from "@/components/media/youtube";
import MoviePage from "@/components/page/MoviePage";
import GlobalSearch from "@/components/ui/Search";

export default function Page() {
  return (
    <MainLayoutClient>
      <div className="sticky top-4 z-50 flex justify-end">
        <GlobalSearch />
      </div>

      <YoutubePlayer />
      <MoviePage />
    </MainLayoutClient>
  );
}
