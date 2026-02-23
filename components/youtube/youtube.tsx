"use client";

import { useState } from "react";
import Image from "next/image";
import PlayIcon from "@/assets/PlayIcon.png";

export type YoutubePlayerProps = {
  videoId?: string | null;
};

const YoutubePlayer = ({ videoId }: YoutubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <div className="relative w-full max-w-[1280px] mx-auto aspect-video">
      {!isPlaying ? (
        <div
          className="relative cursor-pointer w-full h-full rounded-xl overflow-hidden"
          onClick={() => setIsPlaying(true)}
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
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="YouTube trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default YoutubePlayer;
