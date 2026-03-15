import React from "react";
import TopLiked from "@/components/recommend/TopLiked";
import TMDBSSR from "@/components/recommend/TMDB_BySSR";

const RecommendPage = () => {
  return (
    <div className="p-10">
      <TopLiked />
      <TMDBSSR />
    </div>
  );
};

export default RecommendPage;
