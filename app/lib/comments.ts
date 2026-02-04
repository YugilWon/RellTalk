import { supabase } from "@/utils/supabase/client";

/* 댓글 목록 */
export async function fetchComments(movieId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id")
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
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
