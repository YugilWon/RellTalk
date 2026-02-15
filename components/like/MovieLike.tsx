"use client";

import LikeButton from "../like/LikeButton";
import { useUser } from "@/hooks/useUser";
import { useLikeSummary } from "@/hooks/useLike";

interface MovieLikeProps {
  movieId: string;
}

export default function MovieLike({ movieId }: MovieLikeProps) {
  const { data: user } = useUser();

  const { data } = useLikeSummary(movieId, "movie", user?.id);

  return (
    <LikeButton
      targetId={movieId}
      targetType="movie"
      isLiked={data?.isLiked ?? false}
      likeCount={data?.likeCount ?? 0}
      userId={user?.id}
    />
  );
}
