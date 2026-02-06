import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment } from "@/app/lib/comments";
import { CommentTargetType } from "@/(types)/interface";

export const useComments = (
  targetId: string,
  targetType: CommentTargetType,
) => {
  return useQuery({
    queryKey: ["comments", targetType, targetId],
    queryFn: () => fetchComments({ targetId, targetType }),
    enabled: !!targetId,
  });
};

export const useCreateComment = (
  targetId: string,
  targetType: CommentTargetType,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", targetType, targetId],
      });
    },
  });
};
