import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
  page: number,
) => {
  return useQuery({
    queryKey: ["comments", targetId, targetType, page],
    queryFn: () =>
      fetchParentComments({
        targetId,
        targetType,
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
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentPayload) => createComment(data),

    onSuccess: () => {
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

  return useMutation({
    mutationFn: (data: UpdateCommentPayload) => updateComment(data),

    onSuccess: () => {
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
