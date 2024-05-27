"use client";
import React, { useState } from "react";
import YoutubePlayer from "../pages/youtube";
import MoviePage from "../pages/pages";
import Login from "./logIn";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./recoil/recoilState";

const SideBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  return (
    <div className="flex">
      <div
        className={`fixed left-0 top-0 h-screen transition-width duration-300 ${
          isHovered ? "w-64" : "w-16"
        } bg-gray-800 text-white`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 cursor-pointer flex items-center justify-between">
          <span>{isHovered ? "SideBar Name" : "->"}</span>
          {isHovered && <Login />}
        </div>
        <div
          className={`transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ul>
            <li className="p-2 hover:bg-gray-600">자유 게시판</li>
            <li className="p-2 hover:bg-gray-600">추천작</li>
            <li className="p-2 hover:bg-gray-600">고객센터</li>
          </ul>
        </div>
      </div>

      <div
        className={`flex-1 transition-margin duration-300 ${
          isHovered ? "ml-64" : "ml-16"
        } p-4`}
      >
        <YoutubePlayer />
        <MoviePage />
      </div>
    </div>
  );
};

export default SideBar;
