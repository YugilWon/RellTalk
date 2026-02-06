"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

const YoutubePlayer = () => {
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const createPlayer = () => {
        const playerContainer = document.getElementById("youtube-player");
        if (playerContainer) {
          playerContainer.innerHTML = "";
        }

        const player = new window.YT.Player("youtube-player", {
          height: "720",
          width: "100%",
          videoId: "",
          playerVars: {
            autoplay: 1,
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
  }, []);

  return (
    <div className="flex justify-center bg-black py-8">
      <div
        id="youtube-player"
        className="w-full"
        aria-label="YouTube video player"
      />
    </div>
  );
};

export default YoutubePlayer;
