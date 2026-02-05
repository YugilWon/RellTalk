import { supabase } from "@/utils/supabase/client";

/* 댓글 목록 */
export async function fetchComments(movieId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id, 
      content, 
      created_at, 
      user_id,
      profiles (
        nickname,
        avatar_url
      )
    `,
    )
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // 2. 여기서 'as unknown as'를 사용하여 타입을 강제로 매칭시킨 후 변환합니다.
  const rawData = data as unknown as SupabaseCommentPayload[];

  return rawData.map((item) => ({
    id: item.id,
    content: item.content,
    created_at: item.created_at,
    user_id: item.user_id,
    nickname: item.profiles?.nickname ?? "익명 유저",
    avatar_url: item.profiles?.avatar_url ?? null,
  }));
}

/* 댓글 작성 */
export async function createComment({
  movieId,
  content,
}: {
  movieId: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ movie_id: movieId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* 댓글 수정 */
export async function updateComment({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id);

  if (error) throw error;
}

/* 댓글 삭제 */
export async function deleteComment(id: string) {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}
