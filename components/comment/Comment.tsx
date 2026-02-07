"use client";

import { useState } from "react";
import {
  useCreateComment,
  useComments,
  useUpdateComment,
  useDeleteComment,
} from "./useComment";
import { useUser } from "@/hooks/useUser";
import { CommentTargetType } from "@/(types)/interface";
import CommentCard from "./CommentItem";

export default function Comments({
  targetId,
  targetType,
}: {
  targetId: string;
  targetType: CommentTargetType;
}) {
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useComments(targetId, targetType);
  const { data: user } = useUser();

  const currentUser = user
    ? {
        id: user.id,
        nickname: user.user_metadata?.nickname,
        avatarUrl: user.user_metadata?.avatar_url,
      }
    : undefined;

  const createMutation = useCreateComment(targetId, targetType, currentUser);

  const updateMutation = useUpdateComment(targetId, targetType);
  const deleteMutation = useDeleteComment(targetId, targetType);

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
          <div className="flex flex-col sm:flex-row justify-end mt-3 gap-2">
            <button
              onClick={() =>
                createMutation.mutate(
                  { targetId, targetType, content },
                  {
                    onSuccess: () => setContent(""),
                  },
                )
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
          {comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              user={currentUser}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
