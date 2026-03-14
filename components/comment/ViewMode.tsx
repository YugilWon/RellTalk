import React from "react";
import LikeButton from "../like/LikeButton";
import { ViewModeProps } from "@/(types)/interface";
import Image from "next/image";

function ViewMode({
  comment,
  user,
  isEdited,
  setEditing,
  setEditContent,
  deleteMutation,
  likeCount,
  isLiked,
  onReply,
}: ViewModeProps) {
  const handleDelete = () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    deleteMutation.mutate(comment.id);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditContent(comment.content);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={comment.avatarUrl ?? "/NoImage.png"}
          alt={comment.nickname ?? "익명"}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <p className="font-semibold text-sm md:text-base text-gray-100">
          {comment.nickname}
        </p>
      </div>

      <p className="text-xs md:text-sm text-gray-200 leading-relaxed mb-2">
        {comment.content}
      </p>

      <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-400">
        <span>
          {new Date(comment.createdAt).toLocaleString()}
          {isEdited && <span className="ml-1 opacity-70">(수정됨)</span>}
        </span>

        <div className="flex items-center gap-4">
          <LikeButton
            targetId={comment.id}
            targetType="comment"
            isLiked={isLiked}
            likeCount={likeCount}
            userId={user?.id}
          />

          <button onClick={onReply} className="hover:text-white transition">
            답글
          </button>

          {user && comment.userId === user.id && (
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="hover:text-white transition"
              >
                수정
              </button>

              <button
                onClick={handleDelete}
                className="hover:text-white transition"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(ViewMode);
