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
import { Comment } from "@/(types)/interface";
// interface Comment {
//   id: string;
//   content: string;
//   created_at: string;
//   user_id: string;
// }

export default function Comments({ movieId }: { movieId: string }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: user } = useUser();

  /* 댓글 목록 */
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", movieId],
    queryFn: () => fetchComments(movieId),
    enabled: !!movieId,
  });

  /* 댓글 작성 */
  const createMutation = useMutation({
    mutationFn: createComment,

    onMutate: async ({ content }) => {
      if (!user) return;

      await queryClient.cancelQueries({
        queryKey: ["comments", movieId],
      });

      const prev = queryClient.getQueryData<Comment[]>(["comments", movieId]);

      queryClient.setQueryData<Comment[]>(["comments", movieId], (old) => [
        {
          id: `temp-${Date.now()}`,
          content,
          created_at: new Date().toISOString(),
          user_id: user.id,
        },
        ...(old ?? []),
      ]);

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["comments", movieId], ctx.prev);
      }
    },

    onSettled: () => {
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", movieId],
      });
    },
  });

  /* 댓글 수정 */
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      setEditingId(null);
      setEditContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", movieId],
      });
    },
  });

  /* 댓글 삭제 */
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", movieId],
      });
    },
  });

  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-xl p-6 text-center text-gray-400">
        댓글을 작성하려면 로그인하세요
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* 작성 */}
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
            onClick={() => createMutation.mutate({ movieId, content })}
            disabled={!content.trim() || createMutation.isPending}
            className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-500
                       text-sm font-semibold transition disabled:opacity-50"
          >
            등록
          </button>
        </div>
      </div>

      {/* 목록 */}
      {isLoading ? (
        <p className="text-gray-400">불러오는 중...</p>
      ) : (
        <ul className="space-y-4">
          {comments?.map((comment) => (
            <li
              key={comment.id}
              className="bg-neutral-900 rounded-lg p-4 text-sm"
            >
              {editingId === comment.id ? (
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
                      className="hover:text-white"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="hover:text-white"
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-200">{comment.content}</p>
                  <span className="block mt-2 text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>

                  {comment.user_id === user.id && (
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="hover:text-white"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(comment.id)}
                        className="hover:text-white"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
