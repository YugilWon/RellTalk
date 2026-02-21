"use client";

import { useState } from "react";
import SideBar from "../ui/SideBar";
import useAuthCheck from "@/components/auth/useAuthCheck";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCheck();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#121318] text-gray-200">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 transition-all duration-300 p-8">{children}</main>
    </div>
  );
}
