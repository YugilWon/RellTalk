"use client";

import LikeButton from "./LikeButton";
import { LikeTargetType } from "@/(types)/interface";

type Props = {
  targetId: string;
  targetType: LikeTargetType;
  likeCount: number;
  isLiked: boolean;
  queryKey: unknown[];
  userId?: string;
  className?: string;
};

export default function LikeSection({
  targetId,
  targetType,
  likeCount,
  isLiked,
  queryKey,
  userId,
  className,
}: Props) {
  return (
    <div className={className}>
      <LikeButton
        targetId={targetId}
        targetType={targetType}
        isLiked={isLiked}
        likeCount={likeCount}
        queryKey={queryKey}
        userId={userId}
      />
    </div>
  );
}
