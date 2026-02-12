"use client";

import React, { useState } from "react";
import { CommentCardProps } from "@/(types)/interface";
import EditMode from "./EidtMode";
import ViewMode from "./ViewMode";

export default function CommentCard({
  comment,
  user,
  updateMutation,
  deleteMutation,
  likeMutation,
}: CommentCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isEdited = comment.updatedAt !== comment.createdAt;

  const handleLike = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    likeMutation.mutate({
      targetId: comment.id,
      isLiked: comment.isLiked ?? false,
    });
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
        />
      )}
    </li>
  );
}
