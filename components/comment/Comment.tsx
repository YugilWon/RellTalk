"use client";

import {
  useCreateComment,
  useComments,
  useUpdateComment,
  useDeleteComment,
} from "./useComment";
import { useUser } from "@/hooks/useUser";
import { CommentTargetType } from "@/(types)/interface";
import CommentCard from "./CommentItem";
import CommentForm from "./CommentForm";
import LoginRequiredMessage from "../common/LoginLequireMessage";
import { useState } from "react";

export default function Comments({
  targetId,
  targetType,
}: {
  targetId: string;
  targetType: CommentTargetType;
}) {
  const [page, setPage] = useState(1);
  const { data: user } = useUser();

  const { data, isLoading } = useComments(targetId, targetType, user?.id, page);

  const comments = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

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
          <CommentForm
            onSubmit={(content) =>
              createMutation.mutate({ targetId, targetType, content })
            }
            isPending={createMutation.isPending}
          />
        </div>
      ) : (
        <LoginRequiredMessage message="댓글을 작성하려면 로그인하세요" />
      )}

      {isLoading ? (
        <p className="text-gray-400">불러오는 중...</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              user={currentUser}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
              createMutation={createMutation}
              comments={comments}
            />
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-white text-black"
                  : "bg-neutral-800 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
