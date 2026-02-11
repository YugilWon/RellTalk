import { supabase } from "@/utils/supabase/client";

export const fetchLikes = async (
  targetIds: string[],
  targetType: "comment" | "movie" | "post",
) => {
  if (targetIds.length === 0) return [];

  const { data, error } = await supabase
    .from("likes")
    .select("target_id, user_id")
    .in("target_id", targetIds)
    .eq("target_type", targetType);

  if (error) throw error;
  return data;
};

export const likeComment = async (commentId: string, userId: string) => {
  const { error } = await supabase.from("likes").insert({
    target_id: commentId,
    target_type: "comment",
    user_id: userId,
  });

  if (error) throw error;
};

export const unlikeComment = async (commentId: string, userId: string) => {
  const { error } = await supabase.from("likes").delete().match({
    target_id: commentId,
    target_type: "comment",
    user_id: userId,
  });

  if (error) throw error;
};
