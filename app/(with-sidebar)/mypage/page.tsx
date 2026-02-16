import MyPageLayOut from "@/components/mypage/MyPageLayOut";

export default function MyPage() {
  return (
    <main className="flex-1 min-h-screen p-8 bg-[#121318] text-gray-200">
      <h1 className="text-3xl font-bold mb-6">마이 페이지</h1>
      <MyPageLayOut />
    </main>
  );
}
