import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  fetchParentComments,
  fetchChildComments,
} from "@/app/lib/comments";
import {
  CommentTargetType,
  CreateCommentPayload,
  UpdateCommentPayload,
} from "@/(types)/interface";

export const useComments = (
  targetId: string,
  targetType: CommentTargetType,
  userId: string | undefined,
  page: number,
) => {
  return useQuery({
    queryKey: ["comments", targetId, targetType, userId, page],
    queryFn: () =>
      fetchParentComments({
        targetId,
        targetType,
        userId,
        page,
      }),
    enabled: !!targetId,
    placeholderData: (previousData) => previousData,
  });
};

export const useChildComments = (parentId: string | null, userId?: string) => {
  return useQuery({
    queryKey: ["childComments", parentId],
    queryFn: () =>
      fetchChildComments({
        parentId: parentId!,
        userId,
      }),
    enabled: !!parentId,
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
        parentId: newCommentData.parentId ?? null,
      };

      queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
        if (!old) return [tempComment];

        if (!newCommentData.parentId) {
          return [tempComment, ...old];
        }
        //이 부분이 답글이면 부모 댓글 아래로 렌더
        const parentIndex = old.findIndex(
          (c) => c.id === newCommentData.parentId,
        );

        if (parentIndex === -1) return old;

        const newList = [...old];
        newList.splice(parentIndex + 1, 0, tempComment);

        return newList;
      });

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
        exact: false,
      });
    },
  });
};

export const useUpdateComment = (
  targetId: string,
  targetType: CommentTargetType,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    UpdateCommentPayload,
    { previousComments?: any[]; queryKey: unknown[] } | undefined
  >({
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
        exact: false,
      });
    },
  });
};

export const useDeleteComment = (
  targetId: string,
  targetType: CommentTargetType,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetId, targetType],
        exact: false,
      });
    },
  });
};
