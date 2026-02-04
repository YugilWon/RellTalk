"use client";

import SideBar from "../ui/SideBar";
import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import useAuthCheck from "@/components/hooks/useAuthCheck";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCheck();
  const isHovered = useRecoilValue(isHoveredState);

  return (
    <>
      <SideBar />
      <div
        className={`flex-1 transition-margin duration-300 ${
          isHovered ? "ml-64" : "ml-16"
        } p-4`}
      >
        {children}
      </div>
    </>
  );
}
