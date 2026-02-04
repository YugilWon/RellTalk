import MainLayoutClient from "@/components/page/MainLayOutClient";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
