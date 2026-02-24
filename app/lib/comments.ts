import { supabase } from "@/utils/supabase/client";
import { CommentTargetType } from "@/(types)/interface";

import { fetchLikes } from "./likes";

export async function fetchComments({
  targetId,
  targetType,
  userId,
  parentId,
}: {
  targetId: string;
  targetType: CommentTargetType;
  userId?: string;
  parentId: string | null;
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
      target_id,
      target_type,
      parent_id,
      deleted,
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
  if (!data) return [];

  const commentIds = data.map((c) => c.id);

  const likes = await fetchLikes(commentIds, "comment");

  const likeMap = new Map<string, string[]>();

  likes.forEach((like) => {
    if (!likeMap.has(like.target_id)) {
      likeMap.set(like.target_id, []);
    }
    likeMap.get(like.target_id)!.push(like.user_id);
  });

  return data.map((comment) => {
    const profile = Array.isArray(comment.profiles)
      ? comment.profiles[0]
      : comment.profiles;

    const likeUsers = likeMap.get(comment.id) ?? [];

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      userId: comment.user_id,
      nickname: profile?.nickname || "익명",
      avatarUrl: profile?.avatar_url || "/assets/RillTalk.png",
      targetType: comment.target_type,
      targetId: comment.target_id,
      parentId: comment.parent_id ?? null,
      deleted: comment.deleted ?? false,

      likeCount: likeUsers.length,
      isLiked: userId ? likeUsers.includes(userId) : false,
    };
  });
}

export async function createComment({
  targetId,
  targetType,
  content,
  parentId,
}: {
  targetId: string;
  targetType: CommentTargetType;
  content: string;
  parentId?: string | null;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      target_id: targetId,
      target_type: targetType,
      content,
      parent_id: parentId ?? null,
      deleted: false,
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
  const { error } = await supabase
    .from("comments")
    .update({ deleted: true })
    .eq("id", id);

  if (error) throw error;
}
