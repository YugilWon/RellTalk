"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "../ui/Logo";
import Login from "../auth/logIn";
import { useAuth } from "../auth/useAuth";

interface Menu {
  name: string;
  path: string;
  requireAuth?: boolean;
}

interface SideBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menus: Menu[] = [
  { name: "마이 페이지", path: "/mypage", requireAuth: true },
  { name: "추천작", path: "/recommend" },
  { name: "자유 게시판", path: "/post" },
  { name: "장르별 영화", path: "/genres" },
];

export default function SideBar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SideBarProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { session } = useAuth();
  const isLoggedIn = !!session;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
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

    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {!isDesktop && (
        <button
          className={`
    fixed top-2 z-50 w-10 h-10 rounded-full
    bg-indigo-600 text-white flex items-center justify-center shadow-lg
    transition-all duration-300
    ${isSidebarOpen ? "left-72" : "left-0"}
  `}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          ${isDesktop ? "sticky top-0" : "fixed top-0 left-0 z-40"}
          h-screen flex flex-col
          transition-all duration-300
          bg-[#1a1c23] text-gray-300 shadow-2xl
          ${
            isDesktop
              ? isSidebarOpen
                ? "w-64"
                : "w-20"
              : isSidebarOpen
                ? "w-64"
                : "w-0"
          }
          overflow-hidden
        `}
        onMouseEnter={isDesktop ? () => setIsSidebarOpen(true) : undefined}
        onMouseLeave={isDesktop ? () => setIsSidebarOpen(false) : undefined}
      >
        <div
          className={`flex items-center justify-center transition-all ${
            isSidebarOpen ? "h-24" : "h-20"
          }`}
        >
          {isSidebarOpen ? (
            <Logo />
          ) : (
            <div className="text-2xl font-black text-indigo-500">R</div>
          )}
        </div>

        {isSidebarOpen && (
          <div className="px-4 mt-10">
            <div className="bg-gray-800/40 rounded-2xl p-4 text-center">
              <Login />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 mt-6">
          <ul className="space-y-1">
            {menus.map((menu) => {
              const isActive = pathname === menu.path;

              return (
                <li
                  key={menu.name}
                  onClick={() => handleMenuClick(menu)}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition
                    ${
                      isActive
                        ? "bg-indigo-600/30 text-white"
                        : "hover:bg-indigo-600/20 hover:text-white"
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg ${
                      isActive ? "bg-indigo-500" : "bg-gray-700"
                    }`}
                  />
                  {isSidebarOpen && (
                    <span className="ml-4 font-medium whitespace-nowrap">
                      {menu.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {isSidebarOpen && (
          <div className="p-6 text-center text-xs text-gray-500 border-t border-gray-700/40">
            © 2026 ReelTalk
          </div>
        )}
      </aside>
    </>
  );
}
