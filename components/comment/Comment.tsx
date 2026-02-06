"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/app/lib/comments";
import { useUser } from "@/hooks/useUser";
import {
  Comment,
  CommentTargetType,
  CreateCommentPayload,
} from "@/(types)/interface";

export default function Comments({
  targetId,
  targetType,
}: {
  targetId: string;
  targetType: CommentTargetType;
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: user } = useUser();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", targetId, targetType],
    queryFn: () => fetchComments({ targetId, targetType }),
    enabled: !!targetId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCommentPayload) => createComment(data),

    onMutate: async ({ content, targetId, targetType }) => {
      if (!user) return;

      const queryKey = ["comments", targetId, targetType];

      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData<Comment[]>(queryKey);

      queryClient.setQueryData<Comment[]>(queryKey, (old) => {
        const newComment: Comment = {
          id: `temp-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: user.id,
          nickname: user.user_metadata?.nickname || "나",
          avatarUrl: user.user_metadata?.avatar_url || "",
          targetType,
        };

        return [newComment, ...(old ?? [])];
      });

      return { prev, queryKey };
    },

    onError: (err, _variables, context) => {
      if (context?.prev && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.prev);
      }
    },

    onSettled: (_data, _error, variables) => {
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.targetId, variables.targetType],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      setEditingId(null);
      setEditContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", targetId, targetType],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetId, targetType],
      });
    },
  });

  return (
    <section className="space-y-6">
      {user ? (
        <div className="bg-neutral-900 rounded-xl p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createMutation.isPending}
            placeholder="댓글을 입력하세요"
            className="w-full h-28 resize-none bg-neutral-800 rounded-lg p-4 text-sm
                 text-gray-100 placeholder:text-gray-400
                 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={() =>
                createMutation.mutate({ targetId, targetType, content })
              }
              disabled={!content.trim() || createMutation.isPending}
              className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-500
                   text-sm font-semibold transition disabled:opacity-50"
            >
              등록
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl p-6 text-center text-gray-400">
          댓글을 작성하려면 로그인하세요
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-400">불러오는 중...</p>
      ) : (
        <ul className="space-y-4">
          {comments?.map((comment) => {
            const isEdited =
              comment.updatedAt && comment.updatedAt !== comment.createdAt;

            return (
              <li
                key={comment.id}
                className="bg-neutral-900 rounded-lg p-4 text-sm flex flex-col"
              >
                {editingId === comment.id ? (
                  user &&
                  comment.userId === user.id && (
                    <>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-24 resize-none bg-neutral-800 rounded-lg p-3
                             text-sm text-gray-100 focus:outline-none"
                      />
                      <div className="flex gap-3 mt-2 text-xs text-gray-400">
                        <button
                          onClick={() =>
                            updateMutation.mutate({
                              id: comment.id,
                              content: editContent,
                            })
                          }
                          className="hover:text-white transition"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditContent("");
                          }}
                          className="hover:text-white transition"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comment.avatarUrl}
                        alt={comment.nickname}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="font-bold text-gray-100">
                        {comment.nickname}
                      </p>
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
                              setEditingId(comment.id);
                              setEditContent(comment.content);
                            }}
                            className="hover:text-white transition"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(comment.id)}
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
          })}
        </ul>
      )}
    </section>
  );
}
