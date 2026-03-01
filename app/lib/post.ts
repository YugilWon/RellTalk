import { createClient } from "@/utils/supabase/server";
import { Post } from "@/(types)/interface";

interface GetPostsOptions {
  page?: number;
  limit?: number;
}

export async function getPosts({ page, limit }: GetPostsOptions = {}): Promise<{
  posts: Post[];
  totalCount: number;
}> {
  const supabase = await createClient();

  let query = supabase
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
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (page && limit) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error("게시글을 불러오지 못했습니다.");
  }

  return {
    posts: data ?? [],
    totalCount: count ?? 0,
  };
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

export async function getMyPosts(
  userId: string,
  page: number,
  limit: number,
): Promise<{ posts: Post[]; totalCount: number }> {
  const supabase = await createClient();

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
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
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error("내 게시글을 불러오지 못했습니다.");
  }

  return {
    posts: data ?? [],
    totalCount: count ?? 0,
  };
}
