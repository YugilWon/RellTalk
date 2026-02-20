import dynamic from "next/dynamic";

const Write = dynamic(() => import("@/components/post/Write"), {
  ssr: false,
  loading: () => (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <div className="animate-pulse text-neutral-400">에디터 로딩 중...</div>
    </div>
  ),
});

export default function Page() {
  return <Write />;
}
