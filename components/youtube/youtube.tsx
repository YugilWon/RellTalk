"use client";

import { useState } from "react";
import Image from "next/image";
import PlayIcon from "@/assets/PlayIcon.png";

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
  const [isPlaying, setIsPlaying] = useState(false);

  const loadYouTubeAPI = () => {
    if (!videoId) return;

    const createPlayer = () => {
      const playerContainer = document.getElementById("youtube-player");
      if (!playerContainer) return;

      playerContainer.innerHTML = "";
      new window.YT.Player("youtube-player", {
        height: "720",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
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

  const handlePlayClick = () => {
    setIsPlaying(true);
    setTimeout(() => loadYouTubeAPI(), 100);
  };

  if (!videoId) return null;

  return (
    <div className="relative w-full max-w-[1280px] mx-auto">
      {!isPlaying ? (
        <div
          className="relative cursor-pointer w-full h-[720px] rounded-xl overflow-hidden"
          onClick={handlePlayClick}
        >
          <div className="absolute inset-0 bg-black" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={PlayIcon}
              alt="Play Button"
              width={80}
              height={80}
              className="opacity-80 hover:opacity-100
                         md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]"
            />
          </div>
        </div>
      ) : (
        <div
          id="youtube-player"
          className="w-full h-[720px] rounded-xl overflow-hidden"
        />
      )}
    </div>
  );
};

export default YoutubePlayer;
