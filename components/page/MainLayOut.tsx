"use client";

import SideBar from "../ui/SideBar";
import { useRecoilValue } from "recoil";
import { isHoveredState } from "@/components/recoil/recoilState";
import useAuthCheck from "@/components/auth/useAuthCheck";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCheck();
  const isSidebarOpen = useRecoilValue(isHoveredState);

  return (
    <div>
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
