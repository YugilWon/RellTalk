"use client";

import LikeButton from "../like/LikeButton";
import { useUser } from "@/hooks/useUser";
import { useLikeSummary } from "@/hooks/useLike";

interface PostLikeProps {
  postId: string;
}

export default function PostLike({ postId }: PostLikeProps) {
  const { data: user } = useUser();

  const { data } = useLikeSummary(postId, "post", user?.id);

  return (
    <LikeButton
      targetId={postId}
      targetType="post"
      isLiked={data?.isLiked ?? false}
      likeCount={data?.likeCount ?? 0}
      userId={user?.id}
    />
  );
}
