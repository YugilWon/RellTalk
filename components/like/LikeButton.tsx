"use client";

import { useToggleLike } from "@/hooks/useLikt";
import { LikeTargetType, LikeButtonProps } from "@/(types)/interface";

export default function LikeButton({
  targetId,
  targetType,
  isLiked,
  likeCount,
  queryKey,
  userId,
}: LikeButtonProps) {
  const toggleLike = useToggleLike(queryKey, targetType, userId);

  const handleClick = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    toggleLike.mutate({
      targetId,
      isLiked,
    });
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
