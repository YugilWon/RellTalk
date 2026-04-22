import React from "react";

const MovieCardSkeleton = () => {
  return (
    <li className="w-full animate-pulse list-none">
      <div className="relative overflow-hidden rounded-lg bg-neutral-800 w-full h-48" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-800 rounded w-1/2 opacity-60" />
      </div>
    </li>
  );
};

export default MovieCardSkeleton;
