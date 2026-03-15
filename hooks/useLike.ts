import { LikeTargetType } from "@/types/interface";
import { supabase } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const addLike = async (
  targetId: string,
  targetType: LikeTargetType,
  userId: string,
) => {
  const { error } = await supabase.from("likes").insert({
    target_id: targetId,
    target_type: targetType,
    user_id: userId,
  });

  if (error) throw error;
};

export const removeLike = async (
  targetId: string,
  targetType: LikeTargetType,
  userId: string,
) => {
  const { error } = await supabase.from("likes").delete().match({
    target_id: targetId,
    target_type: targetType,
    user_id: userId,
  });

  if (error) throw error;
};

export const useToggleLike = (
  targetId: string,
  targetType: LikeTargetType,
  userId?: string,
) => {
  const queryClient = useQueryClient();
  const queryKey = ["likeSummary", targetId, targetType];

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (!userId) throw new Error("No user");

      if (isLiked) {
        return removeLike(targetId, targetType, userId);
      } else {
        return addLike(targetId, targetType, userId);
      }
    },

    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          likeCount: isLiked
            ? Math.max(old.likeCount - 1, 0)
            : old.likeCount + 1,
          isLiked: !isLiked,
        };
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

const fetchLikeSummary = async (
  targetId: string,
  targetType: LikeTargetType,
  userId?: string,
) => {
  const { data, error } = await supabase
    .from("likes")
    .select("user_id")
    .eq("target_id", targetId)
    .eq("target_type", targetType);

  if (error) throw error;

  return {
    id: targetId,
    likeCount: data.length,
    isLiked: userId ? data.some((l) => l.user_id === userId) : false,
  };
};

export const useLikeSummary = (
  targetId: string,
  targetType: LikeTargetType,
  userId?: string,
) => {
  return useQuery({
    queryKey: ["likeSummary", targetId, targetType, userId],
    queryFn: () => fetchLikeSummary(targetId, targetType, userId),
  });
};
