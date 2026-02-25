"use client";

import { useState } from "react";

export default function OverView({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-3xl">
      <p
        className={`text-gray-300 text-sm sm:text-base leading-relaxed transition-all duration-300 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>

      {text.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs sm:text-sm text-gray-400 hover:text-white transition"
        >
          {expanded ? "접기" : "더 보기"}
        </button>
      )}
    </div>
  );
}
