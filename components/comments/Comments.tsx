"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment } from "@/app/lib/comments";
import { useUser } from "@/hooks/useUser";
import { Comment } from "@/(types)/interface";

export default function Comments({ movieId }: { movieId: string }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  /* 🔐 전역 로그인 상태 */
  const { data: user, isLoading: userLoading } = useUser();

  /* 📥 댓글 목록 */
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", movieId],
    queryFn: () => fetchComments(movieId),
  });

  /* ✍️ 댓글 작성 */
  const { mutate, isPending } = useMutation({
    mutationFn: createComment,

    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", movieId],
      });
    },
  });

  if (userLoading) return null;

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
          placeholder="댓글을 입력하세요"
          className="w-full h-28 resize-none bg-neutral-800 rounded-lg p-4 text-sm
                     placeholder:text-gray-400 focus:outline-none
                     focus:ring-2 focus:ring-red-500"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={() => mutate({ movieId, content })}
            disabled={!content.trim() || isPending}
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
              <p className="text-gray-200">{comment.content}</p>
              <span className="block mt-2 text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
