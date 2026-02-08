import MainLayout from "@/components/page/MainLayOut";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
