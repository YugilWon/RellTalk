"use client";

import { useState } from "react";
import YoutubePlayer from "../youtube/youtube";
export default function TrailerSection() {
  const [play, setPlay] = useState(false);

  <section
    className="
    relative w-full aspect-video bg-black overflow-hidden
    max-h-[220px] sm:max-h-none
    rounded-none sm:rounded-xl
    sm:max-w-5xl sm:mx-auto
  "
  >
    <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

    {!play && (
      <button
        onClick={() => setPlay(true)}
        className="
        absolute inset-0 flex items-center justify-center
        bg-black/60 sm:bg-black/40
        hover:bg-black/70 sm:hover:bg-black/60
        transition
      "
      >
        <span className="text-white text-6xl sm:text-7xl">▶</span>
      </button>
    )}

    {play && <YoutubePlayer />}
  </section>;
}
