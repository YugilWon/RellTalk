"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import MoviePage from "../pages/pages";
import YoutubePlayer from "../pages/youtube";

export default function MainPage() {
  return (
    <RecoilRoot>
      <>
        <YoutubePlayer />
        <MoviePage />
      </>
    </RecoilRoot>
  );
}
