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

export default function Comments({
  targetId,
  targetType,
}: {
  targetId: string;
  targetType: CommentTargetType;
}) {
  const { data: user } = useUser();

  const { data: comments, isLoading } = useComments(
    targetId,
    targetType,
    null,
    user?.id,
  );

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
          {comments
            ?.filter((comment) => comment.parentId === null)
            .map((comment) => (
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
    </section>
  );
}
