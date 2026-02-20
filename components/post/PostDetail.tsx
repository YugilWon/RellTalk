"use client";

import Image from "next/image";
import { Post } from "@/(types)/interface";
import DOMPurify from "dompurify";

interface Props {
  post: Post;
}

export default function PostDetail({ post }: Props) {
  const author = Array.isArray(post.profiles)
    ? post.profiles[0]
    : post.profiles;

  const cleanContent = DOMPurify.sanitize(post.content);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 shadow-md">
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <Image
            src={author?.avatar_url ?? "/default-avatar.png"}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-white">
              {author?.nickname ?? "알 수 없음"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div
          className="prose prose-invert max-w-full break-words text-gray-200"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </div>
    </div>
  );
}
