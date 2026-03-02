"use client";

import { useQuery } from "@tanstack/react-query";

interface Params {
  userId: string;
  page: number;
  limit: number;
}

export function useMyPostQuery({ userId, page, limit }: Params) {
  return useQuery({
    queryKey: ["myPosts", userId, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/mypost?userId=${userId}&page=${page}&limit=${limit}`,
      );

      if (!res.ok) {
        throw new Error("내 게시글을 불러오지 못했습니다.");
      }

      return res.json();
    },
    enabled: !!userId,
    staleTime: 10000,
    placeholderData: (prev) => prev,
  });
}
