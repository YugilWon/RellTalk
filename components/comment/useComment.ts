import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/app/lib/comments";
import {
  CommentTargetType,
  CreateCommentPayload,
  UpdateCommentPayload,
} from "@/(types)/interface";

export const useComments = (
  targetId: string,
  targetType: CommentTargetType,
  userId?: string,
) => {
  return useQuery({
    queryKey: ["comments", targetId, targetType, userId],
    queryFn: () => fetchComments({ targetId, targetType, userId }),
    enabled: !!targetId,
  });
};

export const useCreateComment = (
  targetId: string,
  targetType: CommentTargetType,
  user?: { id: string; nickname?: string; avatarUrl?: string },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentPayload) => createComment(data),

    onMutate: async (newCommentData) => {
      if (!user) return;

      const queryKey = ["comments", targetId, targetType];
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey) as any[];

      const tempComment = {
        id: `temp-${Date.now()}`,
        content: newCommentData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        nickname: user.nickname || "알 수 없음",
        avatarUrl: user.avatarUrl || "",
        targetType,
      };

      queryClient.setQueryData(queryKey, (old: any[] | undefined) => [
        tempComment,
        ...(old ?? []),
      ]);

      return { previousComments, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousComments && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetId, targetType],
      });
    },
  });
};

export const useUpdateComment = (
  targetId: string,
  targetType: CommentTargetType,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentPayload) => updateComment(data),

    onMutate: async (updatedComment) => {
      const queryKey = ["comments", targetId, targetType];
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey) as any[];

      queryClient.setQueryData(queryKey, (old: any[] = []) =>
        old.map((c) =>
          c.id === updatedComment.id
            ? {
                ...c,
                content: updatedComment.content,
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );

      return { previousComments, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousComments && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetId, targetType],
      });
    },
  });
};

export const useDeleteComment = (
  targetId: string,
  targetType: CommentTargetType,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetId, targetType],
      });
    },
  });
};
