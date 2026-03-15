"use client";

import { useToggleLike } from "@/hooks/useLike";
import { LikeButtonProps } from "@/types/interface";

export default function LikeButton({
  targetId,
  targetType,
  isLiked,
  likeCount,
  userId,
}: LikeButtonProps) {
  const toggleLike = useToggleLike(targetId, targetType, userId);

  const handleClick = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    toggleLike.mutate(isLiked);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 transition ${
        isLiked ? "text-red-500" : "hover:text-white text-gray-400"
      }`}
    >
      <span className="text-base md:text-lg">{isLiked ? "❤️" : "🤍"}</span>
      <span>{likeCount ?? 0}</span>
    </button>
  );
}
