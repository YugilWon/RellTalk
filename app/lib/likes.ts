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

export const likeTarget = async (
  targetId: string,
  targetType: "comment" | "movie" | "post",
  userId: string,
) => {
  const { error } = await supabase.from("likes").insert({
    target_id: targetId,
    target_type: targetType,
    user_id: userId,
  });

  if (error) throw error;
};

export const unlikeTarget = async (
  targetId: string,
  targetType: "comment" | "movie" | "post",
  userId: string,
) => {
  const { error } = await supabase.from("likes").delete().match({
    target_id: targetId,
    target_type: targetType,
    user_id: userId,
  });

  if (error) throw error;
};

export async function fetchLikedMovies(userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .select("target_id")
    .eq("user_id", userId)
    .eq("target_type", "movie");

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.target_id);
}
