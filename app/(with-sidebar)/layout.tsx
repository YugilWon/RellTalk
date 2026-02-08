import MainLayout from "@/components/page/MainLayOut";
import { Analytics } from "@vercel/analytics/next";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
