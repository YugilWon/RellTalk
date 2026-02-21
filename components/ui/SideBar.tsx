"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRecoilState } from "recoil";
import { isHoveredState } from "../recoil/recoilState";
import Logo from "../ui/Logo";
import Login from "../auth/logIn";
import { useAuth } from "../auth/useAuth";

interface Menu {
  name: string;
  path: string;
  requireAuth?: boolean;
}

const menus: Menu[] = [
  { name: "마이 페이지", path: "/mypage", requireAuth: true },
  { name: "추천작", path: "/recommend" },
  { name: "자유 게시판", path: "/post" },
];

const SideBar = () => {
  const [isHovered, setIsHovered] = useRecoilState(isHoveredState);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useAuth();
  const isLoggedIn = !!session;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMenuClick = (menu: Menu) => {
    if (menu.requireAuth && !isLoggedIn) {
      alert("로그인이 필요합니다!");
      return;
    }
    router.push(menu.path);
    if (!isDesktop) setIsSidebarOpen(false);
  };

  return (
    <>
      {!isDesktop && (
        <button
          className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full
                     bg-indigo-600 text-white flex items-center justify-center
                     shadow-lg sm:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
      )}

      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        id="sidebar"
        className={`
          fixed top-0 left-0 h-screen z-40 flex flex-col
          transition-all duration-300 ease-in-out shadow-2xl
          bg-[#1a1c23] text-gray-300
          ${isDesktop ? (isHovered ? "w-64" : "w-20") : isSidebarOpen ? "w-64" : "w-0"}
          overflow-hidden
        `}
        onMouseEnter={isDesktop ? () => setIsHovered(true) : undefined}
        onMouseLeave={isDesktop ? () => setIsHovered(false) : undefined}
      >
        <div
          className={`relative flex items-center justify-center w-full
            transition-all duration-300
            ${isHovered || isSidebarOpen ? "h-24" : "h-20"}`}
        >
          {isHovered || isSidebarOpen ? (
            <div className="absolute w-full flex justify-center">
              <Logo />
            </div>
          ) : (
            <div className="text-2xl font-black text-indigo-500">R</div>
          )}
        </div>

        <div
          className={`px-4 transition-all duration-300
            ${isHovered || isSidebarOpen ? "opacity-100 mt-10" : "opacity-0 invisible h-0 overflow-hidden"}`}
        >
          <div
            className="bg-gray-800/40 rounded-2xl p-4 text-center
                       border border-gray-700/50 shadow-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <Login />
          </div>
        </div>

        {(isHovered || isSidebarOpen) && (
          <div className="mx-8 border-b border-gray-700/30 my-6" />
        )}

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {menus.map((menu) => {
              const isActive = pathname === menu.path;

              return (
                <li
                  key={menu.name}
                  className={`group flex items-center p-3 rounded-xl
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-indigo-600/30 text-white"
                        : "hover:bg-indigo-600/20 hover:text-white"
                    }`}
                  onClick={() => handleMenuClick(menu)}
                >
                  <div
                    className={`w-6 h-6 rounded-lg shadow-sm transition-colors
                      ${
                        isActive
                          ? "bg-indigo-500"
                          : "bg-gray-700 group-hover:bg-indigo-500"
                      }`}
                  />
                  {(isHovered || isSidebarOpen) && (
                    <span className="ml-4 font-medium whitespace-nowrap">
                      {menu.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`p-6 transition-opacity duration-300
            ${isHovered || isSidebarOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className="pt-4 border-t border-gray-700/50
                      text-[10px] text-gray-500 text-center tracking-widest uppercase"
          >
            © 2026 ReelTalk
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
