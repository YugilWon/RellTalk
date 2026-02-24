import { createClient } from "@/utils/supabase/server";
import { Post } from "@/(types)/interface";

export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      created_at,
      profiles (
        id,
        nickname,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("게시글을 불러오지 못했습니다.");
  }

  return data ?? [];
}

export async function getPostById(
  id: string,
): Promise<(Post & { likeCount: number; isLiked: boolean }) | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      created_at,
      profiles (
        id,
        nickname,
        avatar_url
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !post) {
    console.error("게시글 조회 실패:", error);
    return null;
  }

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("target_id", id)
    .eq("target_type", "post");

  let isLiked = false;

  if (user) {
    const { data: liked } = await supabase
      .from("likes")
      .select("id")
      .eq("target_id", id)
      .eq("target_type", "post")
      .eq("user_id", user.id)
      .maybeSingle();

    isLiked = !!liked;
  }

  return {
    ...post,
    likeCount: count ?? 0,
    isLiked,
  };
}
