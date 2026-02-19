import React from "react";
import TopLiked from "@/components/recommend/TopLiked";
import TMDBPopular from "@/components/recommend/TMDBPopular";
export const dynamic = "force-dynamic";

const RecommendPage = () => {
  return (
    <div className="p-10">
      <TopLiked />
      <TMDBPopular />
    </div>
  );
};

export default RecommendPage;
