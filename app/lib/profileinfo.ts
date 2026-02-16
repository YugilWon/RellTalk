import { supabase } from "@/utils/supabase/client";

export async function getProfileInfo(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("nickname, avatar_url")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return { nickname: data.nickname, avatarUrl: data.avatar_url };
}
