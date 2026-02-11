"use client";

import React, { useState } from "react";
import { CommentCardProps } from "@/(types)/interface";

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
        <>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-24 resize-none bg-neutral-800 rounded-lg p-3
                   text-xs md:text-sm text-gray-100 focus:outline-none"
          />
          <div className="flex gap-4 mt-2 text-[11px] md:text-xs text-gray-400">
            <button
              onClick={() => {
                if (window.confirm("댓글을 수정하시겠습니까?")) {
                  updateMutation.mutate(
                    { id: comment.id, content: editContent },
                    { onSuccess: () => setEditing(false) },
                  );
                }
              }}
              className="hover:text-white transition"
            >
              저장
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditContent(comment.content);
              }}
              className="hover:text-white transition"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 프로필 영역 */}
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={comment.avatarUrl}
              alt={comment.nickname}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full"
            />
            <p className="font-semibold text-sm md:text-base text-gray-100">
              {comment.nickname}
            </p>
          </div>

          {/* 댓글 내용 */}
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed mb-2">
            {comment.content}
          </p>

          {/* 하단 메타 영역 */}
          <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-400">
            <span>
              {new Date(comment.createdAt).toLocaleString()}
              {isEdited && <span className="ml-1 opacity-70">(수정됨)</span>}
            </span>

            <div className="flex items-center gap-4">
              {/* 좋아요 버튼 */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition ${
                  comment.isLiked
                    ? "text-red-500"
                    : "hover:text-white text-gray-400"
                }`}
              >
                <span className="text-base md:text-lg">
                  {comment.isLiked ? "❤️" : "🤍"}
                </span>
                <span>{comment.likeCount ?? 0}</span>
              </button>

              {/* 수정 삭제 */}
              {user && comment.userId === user.id && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setEditContent(comment.content);
                    }}
                    className="hover:text-white transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("댓글을 삭제하시겠습니까?")) {
                        deleteMutation.mutate(comment.id);
                      }
                    }}
                    className="hover:text-white transition"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </li>
  );
}
