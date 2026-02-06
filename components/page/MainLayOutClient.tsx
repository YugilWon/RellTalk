"use client";

import SideBar from "../ui/SideBar";
import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import useAuthCheck from "@/components/hooks/useAuthCheck";
import Logo from "../ui/Logo";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCheck();
  const isSidebarOpen = useRecoilValue(isHoveredState);

  return (
    <div className="relative flex h-screen">
      <SideBar />

      <div
        className={`flex-1 transition-margin duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } p-4`}
      >
        {children}
      </div>
    </div>
  );
}
