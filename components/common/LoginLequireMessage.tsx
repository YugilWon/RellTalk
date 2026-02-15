export default function LoginRequiredMessage({
  message = "댓글을 작성하려면 로그인하세요",
}: {
  message?: string;
}) {
  return (
    <div className="bg-neutral-900 rounded-xl p-6 text-center text-gray-400">
      {message}
    </div>
  );
}
