"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/post/PostList";
import { Post } from "@/(types)/interface";

interface Props {
  initialPosts: Post[];
  initialTotalCount: number;
  initialPage?: number;
  pageSize?: number;
}

export default function PostListClient({
  initialPosts,
  initialTotalCount,
  initialPage = 1,
  pageSize = 9,
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const limit = pageSize;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      if (page === initialPage) {
        setPosts(initialPosts);
        setTotalCount(initialTotalCount);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/post?page=${page}&limit=${limit}`);
      const data = await res.json();
      setPosts(data.posts);
      setTotalCount(data.totalCount);
      setLoading(false);
    };

    fetchPosts();
  }, [page, initialPage, limit, initialPosts, initialTotalCount]);

  const totalPages = Math.ceil(totalCount / limit);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <PostList
      posts={posts}
      title="자유 게시판"
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}
