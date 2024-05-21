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

    window.onYouTubeIframeAPIReady = () => {
      let player = new window.YT.Player("youtube-player", {
        height: "360",
        width: "100%",
        videoId: "TcMBFSGVi1c",
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {},
      });
    };
  }, []);

  return (
    <div className="flex justify-center bg-black py-8">
      <div id="youtube-player" className="w-full max-w-4xl"></div>
    </div>
  );
};

export default YoutubePlayer;
