"use client";

import { useState } from "react";
import YoutubePlayer from "@/components/media/youtube";

export default function HeroSection() {
  const [play, setPlay] = useState(false);

  return (
    <section className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {/* 가짜 영상 (썸네일 + 버튼) */}
      {!play && (
        <button
          onClick={() => setPlay(true)}
          className="absolute inset-0 flex items-center justify-center
                     bg-black/40 hover:bg-black/60 transition"
        >
          <span className="text-white text-6xl">▶</span>
        </button>
      )}

      {/* 실제 유튜브 (클릭 후) */}
      {play && <YoutubePlayer />}
    </section>
  );
}
