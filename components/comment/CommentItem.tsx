"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { CommentCardProps, CommentWithLike } from "@/types/interface";
import EditMode from "./EidtMode";
import ViewMode from "./ViewMode";
import { useToggleLike, useLikeSummary } from "@/hooks/useLike";
import CommentForm from "./CommentForm";
import { useChildComments } from "./useComment";

type CommentCard = Omit<CommentCardProps, "likeMutation">;

function CommentCard({
  comment,
  user,
  updateMutation,
  deleteMutation,
  createMutation,
}: CommentCard) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const ref = useRef<HTMLLIElement>(null);

  const targetHashRef = useRef<string | null>(null);
  const initialOpenRef = useRef(false);

  useEffect(() => {
    if (targetHashRef.current === null && typeof window !== "undefined") {
      targetHashRef.current = window.location.hash.replace("#comment-", "");
    }
  }, []);

  const targetHash = targetHashRef.current;

  const { data: childComments = [] } = useChildComments(
    showReplies ? comment.id : null,
    user?.id,
  );

  const { data: likeSummary } = useLikeSummary(comment.id, "comment", user?.id);
  const likeMutation = useToggleLike(comment.id, "comment", user?.id);

  const handleLike = useCallback(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    likeMutation.mutate(likeSummary?.isLiked ?? false);
  }, [user, likeMutation, likeSummary?.isLiked]);

  const isEdited = comment.updatedAt !== comment.createdAt;

  const handleReplyToggle = useCallback(() => {
    setReplying((prev) => !prev);
  }, []);

  const toggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  const isTargetChild = useMemo(() => {
    return childComments.some((c) => c.id === targetHash);
  }, [childComments, targetHash]);

  useEffect(() => {
    if (!targetHash) return;

    const isTargetSelf = comment.id === targetHash;

    if (!initialOpenRef.current) {
      if (
        !showReplies &&
        !isTargetSelf &&
        !isTargetChild &&
        comment.replyCount > 0
      ) {
        setShowReplies(true);
      }
      initialOpenRef.current = true;
    }

    if (isTargetSelf || isTargetChild) {
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        ref.current?.classList.add("bg-indigo-50", "ring-2", "ring-indigo-300");

        setTimeout(() => {
          ref.current?.classList.remove(
            "bg-indigo-50",
            "ring-2",
            "ring-indigo-300",
          );
        }, 2000);
      }, 100);
    }
  }, [targetHash, comment.id, showReplies, comment.replyCount, isTargetChild]);

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

      {comment.replyCount > 0 && (
        <button
          className="text-sm text-gray-400 hover:text-white ml-2 text-left"
          onClick={toggleReplies}
        >
          {showReplies
            ? `답글 숨기기 (${comment.replyCount})`
            : `답글 보기 (${comment.replyCount})`}
        </button>
      )}

      {showReplies && childComments.length > 0 && (
        <ul className="ml-8 border-l border-neutral-700 pl-4 space-y-2">
          {childComments.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              user={user}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
              createMutation={createMutation}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default React.memo(CommentCard);
