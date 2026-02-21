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

export async function getPostById(id: string): Promise<Post | null> {
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
    .eq("id", id)
    .single();

  if (error) {
    console.error("게시글 조회 실패:", error);
    return null;
  }

  return data ?? null;
}
