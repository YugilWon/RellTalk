"use client";

import { useRecoilState } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import SideBar from "../ui/SideBar";
import { useEffect, useState } from "react";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useRecoilState(isHoveredState);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover)");
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isDesktop) return null;

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 h-full bg-[#1a1c23] shadow-2xl p-4 transition-transform">
            <SideBar />
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
