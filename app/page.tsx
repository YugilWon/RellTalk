"use client";
import React, { useState } from "react";
import SideBar from "@/components/sideBar";
import useTokenExpiryCheck, {
  TokenExpiryAlert,
} from "@/components/tokenExpireCheck";
import YoutubePlayer from "@/components/youtube";
import MoviePage from "@/pages/home";
import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";

export default function MainPage() {
  const { tokenExpiryAlert, handleAlertClose } = useTokenExpiryCheck();
  const isHovered = useRecoilValue(isHoveredState);
  return (
    <>
      <SideBar />
      <div
        className={`flex-1 transition-margin duration-300 ${
          isHovered ? "ml-64" : "ml-16"
        } p-4`}
      >
        <YoutubePlayer />
        <MoviePage />
      </div>
      {tokenExpiryAlert && <TokenExpiryAlert onClose={handleAlertClose} />}
    </>
  );
}
