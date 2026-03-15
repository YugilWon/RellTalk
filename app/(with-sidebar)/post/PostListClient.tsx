"use client";

import { useState } from "react";
import PostList from "@/components/post/PostList";
import { Post } from "@/types/interface";
import { usePostQuery } from "@/hooks/usePostQuery";
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
  const [page, setPage] = useState(initialPage);

  const { data, isFetching } = usePostQuery({
    page,
    pageSize,
    initialData:
      page === initialPage
        ? {
            posts: initialPosts,
            totalCount: initialTotalCount,
          }
        : undefined,
  });
  const posts = data?.posts ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <PostList
      posts={posts}
      showWriteButton
      title="자유 게시판"
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      isFetching={isFetching}
    />
  );
}
