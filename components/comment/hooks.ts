import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment } from "@/app/lib/comments";

/* 댓글 목록 */
export const useComments = (movieId: string) => {
  return useQuery({
    queryKey: ["comments", movieId],
    queryFn: () => fetchComments(movieId),
    enabled: !!movieId,
  });
};

/* 댓글 작성 */
export const useCreateComment = (movieId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", movieId],
      });
    },
  });
};
