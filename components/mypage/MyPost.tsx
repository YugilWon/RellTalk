"use client";

import { useState } from "react";
import { useMyPostQuery } from "@/hooks/useMyPostQuery";
import PostList from "@/components/post/PostList";

interface MyPostsProps {
  userId: string;
}

export default function MyPost({ userId }: MyPostsProps) {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isFetching } = useMyPostQuery({
    userId,
    page,
    limit,
  });
  if (isLoading) return <div>불러오는 중...</div>;

  const posts = data?.posts ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <PostList
      posts={posts}
      showWriteButton={false}
      title="내가 쓴 글"
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      isFetching={isFetching}
    />
  );
}
