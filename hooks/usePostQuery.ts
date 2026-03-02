"use client";

import { useQuery } from "@tanstack/react-query";

interface Params {
  page: number;
  pageSize: number;
  initialData?: {
    posts: any[];
    totalCount: number;
  };
}

export function usePostQuery({ page, pageSize, initialData }: Params) {
  return useQuery({
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
