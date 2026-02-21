"use client";
import { useRouter } from "next/navigation";

export function usePostActions(postId: string) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/post/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/post/${postId}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`삭제 실패: ${errorData.error ?? res.statusText}`);
        return;
      }

      alert("게시글이 삭제되었습니다.");
      router.push("/post");
    } catch (err) {
      console.error("삭제 중 오류:", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  return { handleEdit, handleDelete };
}
