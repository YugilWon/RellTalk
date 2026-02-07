"use client";
import React, { useState, useEffect } from "react";
import Login from "../auth/logIn";
import { useRecoilState } from "recoil";
import { isHoveredState } from "../recoil/recoilState";
import Logo from "./Logo";

const SideBar = () => {
  const [isHovered, setIsHovered] = useRecoilState(isHoveredState);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 화면 사이즈 체크
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모바일에서 외부 클릭 시 닫기
  useEffect(() => {
    if (!isMobile || !isHovered) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isHovered]);

  const handleToggle = () => {
    if (isMobile) setIsHovered((prev) => !prev);
  };

  return (
    <div className="flex">
      <div
        id="sidebar"
        className={`fixed left-0 top-0 h-screen transition-width duration-300 ${
          isHovered ? "w-64" : "w-16"
        } bg-gray-800 text-white`}
        onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
        onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
        onClick={handleToggle} // 모바일은 클릭으로 토글
      >
        <div className="p-4 cursor-pointer flex items-center justify-between">
          {isHovered ? <Logo /> : "->"}
          {isHovered && <Login />}
        </div>
        <div
          className={`transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ul>
            <li className="p-2 hover:bg-gray-600">마이 페이지</li>
            <li className="p-2 hover:bg-gray-600">추천작</li>
            <li className="p-2 hover:bg-gray-600">고객센터</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
