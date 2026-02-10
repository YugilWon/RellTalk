"use client";
import { useEffect } from "react";

export type YoutubePlayerProps = {
  videoId?: string | null;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

const YoutubePlayer = ({ videoId }: YoutubePlayerProps) => {
  useEffect(() => {
    if (!videoId) return;

    const isMobile =
      typeof window !== "undefined" &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const loadYouTubeAPI = () => {
      const createPlayer = () => {
        const playerContainer = document.getElementById("youtube-player");
        if (playerContainer) {
          playerContainer.innerHTML = "";
        }

        const player = new window.YT.Player("youtube-player", {
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            autoplay: isMobile ? 0 : 1,
            controls: 1,
            modestbranding: 1,
            rel: 1,
            showinfo: 0,
          },
          events: {
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                player.seekTo(0);
                player.playVideo();
              }
            },
          },
        });
      };

      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = createPlayer;
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadYouTubeAPI);
    } else {
      setTimeout(loadYouTubeAPI, 2000);
    }
  }, [videoId]);

  if (!videoId) return null;

  return (
    <div className="flex justify-center bg-black py-8">
      <div
        className="
        relative
        w-full
        aspect-video
        max-h-[450px]
        sm:max-h-none
        "
      >
        <div
          id="youtube-player"
          className="absolute inset-0 w-full h-full"
          aria-label="YouTube video player"
        />
      </div>
    </div>
  );
};

export default YoutubePlayer;
