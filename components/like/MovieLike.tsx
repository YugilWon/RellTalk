"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLikes } from "@/app/lib/likes";
import { useUser } from "@/hooks/useUser";
import { useToggleMovieLike } from "@/hooks/useToggleMovieLike";

interface MovieLikeProps {
  movieId: string;
}

export default function MovieLike({ movieId }: MovieLikeProps) {
  const { data: user } = useUser();

  const { data: likes = [] } = useQuery({
    queryKey: ["likes", movieId, "movie"],
    queryFn: () => fetchLikes([movieId], "movie"),
  });

  const likeCount = likes.length;
  const isLiked = user ? likes.some((l) => l.user_id === user.id) : false;

  const toggleLike = useToggleMovieLike(movieId, user?.id);

  const handleClick = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    toggleLike.mutate(isLiked);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 font-semibold transition ${
        isLiked ? "text-red-500" : "text-white hover:text-red-400"
      }`}
    >
      <span>{isLiked ? "❤️" : "🤍"}</span>
      <span>{likeCount}</span>
    </button>
  );
}
