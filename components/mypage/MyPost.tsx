"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/post/PostList";
import { Post } from "@/(types)/interface";

interface MyPostsProps {
  userId: string;
}

export default function MyPost({ userId }: MyPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const res = await fetch(
        `/api/mypost?userId=${userId}&page=${page}&limit=${limit}`,
      );

      const data = await res.json();

      setPosts(data.posts);
      setTotalCount(data.totalCount);
      setLoading(false);
    };

    fetchPosts();
  }, [userId, page]);

  const totalPages = Math.ceil(totalCount / limit);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <PostList
      posts={posts}
      showWriteButton={false}
      title="내가 쓴 글"
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}
