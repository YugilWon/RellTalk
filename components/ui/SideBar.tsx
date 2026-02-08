"use client";
import React from "react";
import Login from "../auth/logIn";
import { useRecoilState } from "recoil";
import { isHoveredState } from "../recoil/recoilState";
import Logo from "./Logo";

const SideBar = () => {
  const [isHovered, setIsHovered] = useRecoilState(isHoveredState);

  const handleToggle = () => {
    setIsHovered((prev) => !prev);
  };

  return (
    <div
      id="sidebar"
      className={`fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out z-50 flex flex-col shadow-2xl 
        ${isHovered ? "w-64" : "w-20"} bg-[#1a1c23] text-gray-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggle}
    >
      <div
        className={`relative flex items-center justify-center w-full transition-all duration-300 ${isHovered ? "h-24" : "h-20"}`}
      >
        {isHovered ? (
          <div className="absolute top-100 w-full flex justify-center animate-fadeIn transform scale-90">
            <Logo />
          </div>
        ) : (
          <div className="text-2xl font-black text-indigo-500 flex items-center justify-center h-full">
            R
          </div>
        )}
      </div>

      <div
        className={`px-4 transition-all duration-300 ${
          isHovered
            ? "opacity-100 mt-10 visible"
            : "opacity-0 invisible h-0 overflow-hidden"
        }`}
      >
        <div className="bg-gray-800/40 rounded-2xl p-4 text-center border border-gray-700/50 shadow-inner">
          <Login />
        </div>
      </div>

      {isHovered && <div className="mx-8 border-b border-gray-700/30 my-6" />}

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {["마이 페이지", "추천작", "고객센터"].map((menu) => (
            <li
              key={menu}
              className="group flex items-center p-3 rounded-xl hover:bg-indigo-600/20 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <div className="w-6 h-6 bg-gray-700 group-hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex-shrink-0" />
              {isHovered && (
                <span className="ml-4 font-medium whitespace-nowrap animate-slideRight">
                  {menu}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={`p-6 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <div className="pt-4 border-t border-gray-700/50 text-[10px] text-gray-500 text-center tracking-widest uppercase">
          © 2026 ReelTalk
        </div>
      </div>
    </div>
  );
};

export default SideBar;
