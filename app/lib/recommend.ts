import { createClient } from "@/utils/supabase/server";

export async function getLikedMovie() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("likes")
    .select("target_id")
    .eq("target_type", "movie");

  if (error) throw error;

  const countMap: Record<string, number> = {};

  data.forEach((item) => {
    countMap[item.target_id] = (countMap[item.target_id] || 0) + 1;
  });

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return sorted.map(([movieId]) => movieId);
}
