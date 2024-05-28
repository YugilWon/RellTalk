"use client";
import React, { useEffect } from "react";

declare global {
  interface Window {
    customProperty: string;
  }
}

const YoutubePlayer = () => {
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    let player: any;

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player("youtube-player", {
        height: "720",
        width: "100%",
        videoId: "IwZtD0XB7JQ",
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 1,
          showinfo: 0,
          mute: 0,
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    const onPlayerStateChange = (event: any) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        player.seekTo(0);
        player.playVideo();
      }
    };
  }, []);

  return (
    <div className="flex justify-center bg-black py-8">
      <div id="youtube-player" className="w-full"></div>
    </div>
  );
};

export default YoutubePlayer;
