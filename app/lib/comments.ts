import { supabase } from "@/utils/supabase/client";

/* 댓글 목록 */
export async function fetchComments(movieId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      profiles:comments_user_id_profiles_fkey (
        nickname,
        avatar_url
      )
    `,
    )
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((comment) => {
    // profiles가 배열로 들어오므로, 첫 번째 요소([0])를 꺼냅니다.
    // 만약 단일 객체로 설정되어 있지 않다면 Supabase는 기본적으로 배열로 반환합니다.
    const profile = Array.isArray(comment.profiles)
      ? comment.profiles[0]
      : comment.profiles;

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      userId: comment.user_id,
      nickname: profile?.nickname || "익명",
      avatarUrl: profile?.avatar_url || "기본이미지경로",
    };
  });
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
