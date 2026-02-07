"use client";

import React, { useState } from "react";
import { CommentCardProps } from "@/(types)/interface";

export default function CommentCard({
  comment,
  user,
  updateMutation,
  deleteMutation,
}: CommentCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isEdited = comment.updatedAt !== comment.createdAt;

  return (
    <li className="bg-neutral-900 rounded-lg p-4 text-sm flex flex-col">
      {editing && user && comment.userId === user.id ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-24 resize-none bg-neutral-800 rounded-lg p-3
                       text-sm text-gray-100 focus:outline-none"
          />
          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <button
              onClick={() => {
                if (window.confirm("댓글을 수정하시겠습니까?")) {
                  updateMutation.mutate(
                    {
                      id: comment.id,
                      content: editContent,
                    },
                    {
                      onSuccess: () => {
                        setEditing(false);
                        setEditContent("");
                      },
                    },
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
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={comment.avatarUrl}
              alt={comment.nickname}
              className="w-8 h-8 rounded-full"
            />
            <p className="font-bold text-gray-100">{comment.nickname}</p>
          </div>

          <p className="text-gray-200 mb-2">{comment.content}</p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {new Date(comment.createdAt).toLocaleString()}
              {isEdited && <span className="ml-1">(수정됨)</span>}
            </span>

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
        </>
      )}
    </li>
  );
}
