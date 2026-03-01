import Link from "next/link";
import { Post } from "@/(types)/interface";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  showWriteButton?: boolean;
  title?: string;

  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function PostList({
  posts,
  showWriteButton = true,
  title = "게시글",
  page,
  totalPages,
  onPageChange,
}: PostListProps) {
  const getPageNumbers = () => {
    if (!page || !totalPages) return [];

    const maxVisible = 5;
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{title}</h1>

        {showWriteButton && (
          <Link
            href="/write"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition"
          >
            작성하기
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          아직 작성된 게시글이 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {page && totalPages && totalPages > 1 && onPageChange && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
              >
                이전
              </button>

              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => onPageChange(num)}
                  className={`px-3 py-1 rounded ${
                    page === num
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
