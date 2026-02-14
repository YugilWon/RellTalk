"use client";

import React, { useState } from "react";
import { CommentCardProps } from "@/(types)/interface";
import EditMode from "./EidtMode";
import ViewMode from "./ViewMode";
import { useToggleLike, useLikeSummary } from "@/hooks/useLikt";

export default function CommentCard({
  comment,
  user,
  updateMutation,
  deleteMutation,
}: Omit<CommentCardProps, "likeMutation">) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isEdited = comment.updatedAt !== comment.createdAt;

  const { data } = useLikeSummary(comment.id, "comment", user?.id);

  const likeMutation = useToggleLike(comment.id, "comment", user?.id);

  const handleLike = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    likeMutation.mutate(data?.isLiked ?? false);
  };

  return (
    <li className="bg-neutral-900 rounded-xl p-3 md:p-4 flex flex-col">
      {editing && user && comment.userId === user.id ? (
        <EditMode
          comment={comment}
          editContent={editContent}
          setEditContent={setEditContent}
          updateMutation={updateMutation}
          setEditing={setEditing}
        />
      ) : (
        <ViewMode
          comment={comment}
          user={user}
          isEdited={isEdited}
          setEditing={setEditing}
          setEditContent={setEditContent}
          deleteMutation={deleteMutation}
          handleLike={handleLike}
          likeCount={data?.likeCount ?? 0}
          isLiked={data?.isLiked ?? false}
        />
      )}
    </li>
  );
}
