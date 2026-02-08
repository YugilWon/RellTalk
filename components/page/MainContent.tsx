"use client";

import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import TrailerSection from "./TrailerSection";

export default function MainContent() {
  const isHovered = useRecoilValue(isHoveredState);

  return (
    <div
      className={`flex-1 transition-margin duration-300 ${
        isHovered ? "ml-64" : "ml-16"
      } p-4`}
    >
      <TrailerSection />
    </div>
  );
}
