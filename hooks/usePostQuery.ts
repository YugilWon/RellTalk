"use client";

import { useQuery } from "@tanstack/react-query";
import { Post } from "@/types/interface";

interface Params {
  page: number;
  pageSize: number;
  initialData?: {
    posts: Post[];
    totalCount: number;
  };
}

export function usePostQuery({ page, pageSize, initialData }: Params) {
  return useQuery<{ posts: Post[]; totalCount: number }>({
    queryKey: ["posts", page],
    queryFn: async () => {
      const res = await fetch(`/api/post?page=${page}&limit=${pageSize}`);

      if (!res.ok) {
        throw new Error("게시글을 불러오지 못했습니다.");
      }

      return res.json();
    },
    staleTime: 10000,
    placeholderData: (prev) => prev,
    initialData,
  });
}
