"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/(types)/interface";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const author = Array.isArray(post.profiles)
    ? post.profiles[0]
    : post.profiles;

  return (
    <Link
      href={`/post/${post.id}`}
      className="block bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-600 transition shadow-md hover:shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={author?.avatar_url ?? "/default-avatar.png"}
          alt="avatar"
          width={40}
          height={40}
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

      <h2 className="text-lg font-bold text-white line-clamp-2">
        {post.title}
      </h2>
    </Link>
  );
}
