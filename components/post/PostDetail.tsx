"use client";

import Image from "next/image";
import { Post } from "@/types/interface";
import DOMPurify from "dompurify";
import PostLike from "../like/PostLike";
import { useUser } from "@/hooks/useUser";
import { usePostActions } from "./usePostAction";

interface Props {
  post: Post;
}

export default function PostDetail({ post }: Props) {
  const author = Array.isArray(post.profiles)
    ? post.profiles[0]
    : post.profiles;

  const { data: user } = useUser();

  const { handleEdit, handleDelete } = usePostActions(post.id);

  const isAuthor = user?.id === author?.id;

  const cleanContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  })

    .replace(
      /<iframe /g,
      `<div class="relative w-full aspect-video max-w-full"><iframe class="absolute inset-0 w-full h-full"`,
    )
    .replace(/<\/iframe>/g, "</iframe></div>");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-words">
            {post.title}
          </h1>

          {isAuthor && (
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <button
                className="text-white text-sm font-medium transition"
                onClick={handleEdit}
              >
                수정
              </button>
              <button
                className="text-white text-sm font-medium transition"
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Image
            src={author?.avatar_url ?? "/default-avatar.png"}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {author?.nickname ?? "알 수 없음"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <PostLike postId={post.id} />
        </div>

        <div
          className="prose prose-invert max-w-full break-words text-gray-200"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </div>
    </div>
  );
}
