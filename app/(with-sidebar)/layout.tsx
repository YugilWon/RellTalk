import MainLayout from "@/components/movie/MainLayOut";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
