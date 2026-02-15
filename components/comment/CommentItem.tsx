"use client";

import React, { useState } from "react";
import { CommentCardProps, CommentWithLike } from "@/(types)/interface";
import EditMode from "./EidtMode";
import ViewMode from "./ViewMode";
import { useToggleLike, useLikeSummary } from "@/hooks/useLike";
import CommentForm from "./CommentForm";

type CommentCard = Omit<CommentCardProps, "likeMutation"> & {
  comments: CommentWithLike[];
};

export default function CommentCard({
  comment,
  user,
  updateMutation,
  deleteMutation,
  createMutation,
  comments,
}: CommentCard) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

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

  const replies = comments.filter((c) => c.parentId === comment.id);

  return (
    <li className="bg-neutral-900 rounded-xl p-3 md:p-4 flex flex-col space-y-2">
      {comment.deleted ? (
        <p className="text-gray-500 italic">삭제된 댓글입니다</p>
      ) : editing && user && comment.userId === user.id ? (
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
          onReply={() => setReplying((prev) => !prev)}
        />
      )}

      {replying && user && !comment.deleted && (
        <div className="ml-8 border-l border-neutral-700 pl-4">
          <CommentForm
            placeholder="답글을 입력하세요"
            autoFocus
            onSubmit={(content) => {
              if (!createMutation) return;

              createMutation.mutate({
                targetId: comment.targetId,
                targetType: comment.targetType,
                content,
                parentId: comment.id,
              });

              setReplying(false);
              setShowReplies(true);
            }}
          />
        </div>
      )}

      {replies.length > 0 && (
        <button
          className="text-sm text-gray-400 hover:text-white ml-2 text-left"
          onClick={() => setShowReplies((prev) => !prev)}
        >
          {showReplies
            ? `답글 숨기기 (${replies.length})`
            : `답글 보기 (${replies.length})`}
        </button>
      )}

      {showReplies && replies.length > 0 && (
        <ul className="ml-8 border-l border-neutral-700 pl-4 space-y-2">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              user={user}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
              createMutation={createMutation}
              comments={comments}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
