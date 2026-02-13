import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLike, removeLike } from "./useLikt";

export const useToggleMovieLike = (movieId: string, userId?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["likes", movieId, "movie"];

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (!userId) throw new Error("No user");

      if (isLiked) {
        return removeLike(movieId, "movie", userId);
      } else {
        return addLike(movieId, "movie", userId);
      }
    },

    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey) as any[];

      queryClient.setQueryData(queryKey, (old: any[] = []) => {
        if (isLiked) {
          return old.filter((l) => l.user_id !== userId);
        } else {
          return [...old, { target_id: movieId, user_id: userId }];
        }
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
