import { supabase } from "@/utils/supabase/client";
import { CommentTargetType } from "@/(types)/interface";

export async function fetchComments({
  targetId,
  targetType,
}: {
  targetId: string;
  targetType: CommentTargetType;
}) {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      updated_at,
      user_id,
      target_type,
      profiles:comments_user_id_profiles_fkey (
        nickname,
        avatar_url
      )
    `,
    )
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((comment) => {
    // profiles가 배열로 들어오므로
    const profile = Array.isArray(comment.profiles)
      ? comment.profiles[0]
      : comment.profiles;

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      userId: comment.user_id,
      nickname: profile?.nickname || "익명",
      avatarUrl: profile?.avatar_url || "기본이미지경로",
      targetType: comment.target_type,
    };
  });
}

export async function createComment({
  targetId,
  targetType,
  content,
}: {
  targetId: string;
  targetType: CommentTargetType;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      target_id: targetId,
      target_type: targetType,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateComment({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const { error } = await supabase
    .from("comments")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}
