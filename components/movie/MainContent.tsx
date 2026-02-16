"use client";

import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import TrailerSection from "./TrailerSection";

export default function MainContent() {
  const isSideBarOpen = useRecoilValue(isHoveredState);

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-out ${
        isSideBarOpen ? "pl-64" : "pl-16"
      }`}
    >
      <TrailerSection />
    </div>
  );
}
