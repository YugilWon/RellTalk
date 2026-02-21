"use client";

import Link from "next/link";
import { Post } from "@/(types)/interface";
import Image from "next/image";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">게시글</h1>

        <Link
          href="/write"
          className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition"
        >
          작성하기
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          아직 작성된 게시글이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const author = Array.isArray(post.profiles)
              ? post.profiles[0]
              : post.profiles;

            return (
              <Link
                key={post.id}
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
          })}
        </div>
      )}
    </div>
  );
}
