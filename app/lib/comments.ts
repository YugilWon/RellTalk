import { supabase } from "@/utils/supabase/client";
import { CommentTargetType } from "@/(types)/interface";

import { fetchLikes } from "./likes";

const PAGE_SIZE = 20;

export async function fetchParentComments({
  targetId,
  targetType,
  userId,
  page,
}: {
  targetId: string;
  targetType: CommentTargetType;
  userId?: string;
  page: number;
}) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
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
      { count: "exact" },
    )
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .is("parent_id", null)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) throw error;

  const parentIds = (data ?? []).map((c) => c.id);

  const { data: replyRows } = await supabase
    .from("comments")
    .select("parent_id")
    .in("parent_id", parentIds);

  const replyCountMap = new Map<string, number>();

  replyRows?.forEach((row) => {
    const prev = replyCountMap.get(row.parent_id) ?? 0;
    replyCountMap.set(row.parent_id, prev + 1);
  });

  const likes = await fetchLikes(parentIds, "comment");

  const likeMap = new Map<string, string[]>();

  likes.forEach((like) => {
    if (!likeMap.has(like.target_id)) {
      likeMap.set(like.target_id, []);
    }
    likeMap.get(like.target_id)!.push(like.user_id);
  });

  const formatted = (data ?? []).map((comment) => {
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

      replyCount: replyCountMap.get(comment.id) ?? 0,
    };
  });

  return {
    data: formatted,
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export async function fetchChildComments({
  parentId,
  userId,
}: {
  parentId: string;
  userId?: string;
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
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const commentIds = (data ?? []).map((c) => c.id);

  const likes = await fetchLikes(commentIds, "comment");

  const likeMap = new Map<string, string[]>();

  likes.forEach((like) => {
    if (!likeMap.has(like.target_id)) {
      likeMap.set(like.target_id, []);
    }
    likeMap.get(like.target_id)!.push(like.user_id);
  });

  return (data ?? []).map((comment) => {
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
      replyCount: 0,
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comment, error } = await supabase
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

  if (!parentId) {
    if (targetType === "post") {
      const { data: post } = await supabase
        .from("posts")
        .select("user_id")
        .eq("id", targetId)
        .single();

      if (post?.user_id && post.user_id !== user?.id) {
        await supabase.from("notifications").insert({
          user_id: post.user_id,
          actor_id: user?.id,
          type: "comment",
          post_id: targetId,
          comment_id: comment.id,
          target_type: targetType,
        });
      }
    }

    if (targetType === "movie") {
      const { data: movieComment } = await supabase
        .from("comments")
        .select("user_id")
        .eq("target_id", targetId)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (movieComment?.user_id && movieComment.user_id !== user?.id) {
        await supabase.from("notifications").insert({
          user_id: movieComment.user_id,
          actor_id: user?.id,
          type: "comment",
          post_id: targetId,
          comment_id: comment.id,
          target_type: targetType,
        });
      }
    }
  } else {
    const { data: parentComment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", parentId)
      .single();

    if (parentComment?.user_id && parentComment.user_id !== user?.id) {
      await supabase.from("notifications").insert({
        user_id: parentComment.user_id,
        actor_id: user?.id,
        type: "reply",
        post_id: targetId,
        comment_id: comment.id,
        target_type: targetType,
      });
    }
  }

  return comment;
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
