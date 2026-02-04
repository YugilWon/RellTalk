"use client";

import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import HeroSection from "./HeroSection";

export default function MainContentShell() {
  const isHovered = useRecoilValue(isHoveredState);

  return (
    <div
      className={`flex-1 transition-margin duration-300 ${
        isHovered ? "ml-64" : "ml-16"
      } p-4`}
    >
      <HeroSection />
    </div>
  );
}
