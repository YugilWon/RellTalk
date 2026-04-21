"use client";

import React, { useState, useCallback } from "react";
import { CommentCardProps } from "@/types/interface";
import EditMode from "./EidtMode";
import ViewMode from "./ViewMode";
import { useToggleLike, useLikeSummary } from "@/hooks/useLike";
import CommentForm from "./CommentForm";
import { useChildComments } from "./useComment";
import { useCommentScroll } from "@/hooks/useCommentScroll";

type CommentCard = Omit<CommentCardProps, "likeMutation">;

/**
 * 답글 목록 렌더링 컴포넌트
 */
const ReplyList = React.memo(
  ({
    replies,
    user,
    updateMutation,
    deleteMutation,
    createMutation,
    depth,
  }: {
    replies: any[];
    user: any;
    updateMutation: any;
    deleteMutation: any;
    createMutation: any;
    depth: number;
  }) => {
    return (
      <ul className="ml-8 border-l border-neutral-700 pl-4 space-y-2">
        {replies.map((reply) => (
          <CommentCard
            key={reply.id}
            comment={reply}
            user={user}
            updateMutation={updateMutation}
            deleteMutation={deleteMutation}
            createMutation={createMutation}
            depth={depth + 1}
          />
        ))}
      </ul>
    );
  },
);

ReplyList.displayName = "ReplyList";

function CommentCard({
  comment,
  user,
  updateMutation,
  deleteMutation,
  createMutation,
  depth = 0,
}: CommentCard & { depth?: number }) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { data: childComments = [] } = useChildComments(
    showReplies ? comment.id : null,
    user?.id,
  );

  // 로직 추출: 스크롤 및 자동 열기
  const { ref } = useCommentScroll({
    commentId: comment.id,
    isReply: depth > 0,
    childComments,
    showReplies,
    setShowReplies,
    replyCount: comment.replyCount,
  });

  const { data: likeSummary } = useLikeSummary(comment.id, "comment", user?.id);
  const likeMutation = useToggleLike(comment.id, "comment", user?.id);

  const handleLike = useCallback(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    likeMutation.mutate(likeSummary?.isLiked ?? false);
  }, [user, likeMutation, likeSummary?.isLiked]);

  const handleReplyToggle = useCallback(() => {
    setReplying((prev) => !prev);
  }, []);

  const toggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  const handleReplySubmit = useCallback(
    (content: string) => {
      if (!createMutation) return;

      // 뎁스 2(손자)까지만 허용하고 그 이상은 손자 레벨에 고정
      // depth 0(부모) -> depth 1(자식) 생성 (parentId = 부모id)
      // depth 1(자식) -> depth 2(손자) 생성 (parentId = 자식id)
      // depth 2(손자) -> depth 2(손자) 생성 (parentId = 현재손자의 부모id, 즉 자식id)
      const finalParentId = depth >= 2 ? comment.parentId : comment.id;

      createMutation.mutate({
        targetId: comment.targetId,
        targetType: comment.targetType,
        content,
        parentId: finalParentId,
      });
      setReplying(false);
      setShowReplies(true);
    },
    [
      depth,
      comment.parentId,
      comment.id,
      comment.targetId,
      comment.targetType,
      createMutation,
    ],
  );

  const isEdited = comment.updatedAt !== comment.createdAt;

  return (
    <li
      ref={ref}
      id={`comment-${comment.id}`}
      className="bg-neutral-900 rounded-xl p-3 md:p-4 flex flex-col space-y-2 transition-all duration-500"
    >
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
          likeCount={likeSummary?.likeCount ?? 0}
          isLiked={likeSummary?.isLiked ?? false}
          onReply={handleReplyToggle}
        />
      )}

      {replying && user && !comment.deleted && (
        <div className="ml-8 border-l border-neutral-700 pl-4">
          <CommentForm
            placeholder="답글을 입력하세요"
            autoFocus
            initialValue={`@${comment.nickname} `}
            onSubmit={handleReplySubmit}
          />
        </div>
      )}

      {comment.replyCount > 0 && (
        <button
          className="text-sm text-gray-400 hover:text-white ml-2 text-left w-fit transition-colors"
          onClick={toggleReplies}
        >
          {showReplies
            ? `답글 숨기기 (${comment.replyCount})`
            : `답글 보기 (${comment.replyCount})`}
        </button>
      )}

      {depth < 2 && showReplies && childComments.length > 0 && (
        <ReplyList
          replies={childComments}
          user={user}
          updateMutation={updateMutation}
          deleteMutation={deleteMutation}
          createMutation={createMutation}
          depth={depth}
        />
      )}
    </li>
  );
}

export default React.memo(CommentCard);
