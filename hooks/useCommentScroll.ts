import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/utils/supabase/client";

interface UseCommentScrollProps {
  commentId: string;
  isReply: boolean;
  childComments: { id: string }[];
  showReplies: boolean;
  setShowReplies: (show: boolean) => void;
  replyCount: number;
}

export function useCommentScroll({
  commentId,
  isReply,
  childComments,
  showReplies,
  setShowReplies,
  replyCount,
}: UseCommentScrollProps) {
  const ref = useRef<HTMLLIElement>(null);
  const targetHashRef = useRef<string | null>(null);
  const initialOpenRef = useRef(false);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);

  // 1. URL 해시 감지
  useEffect(() => {
    if (targetHashRef.current === null && typeof window !== "undefined") {
      targetHashRef.current = window.location.hash.replace("#comment-", "");
    }
  }, []);

  const targetHash = targetHashRef.current;

  // 2. 알림 타겟이 답글인 경우 부모 확인
  useEffect(() => {
    if (!targetHash || isReply) return;

    const checkParent = async () => {
      const { data } = await supabase
        .from("comments")
        .select("parent_id")
        .eq("id", targetHash)
        .single();

      if (data?.parent_id) {
        setTargetParentId(data.parent_id);
      }
    };

    checkParent();
  }, [targetHash, isReply]);

  // 3. 타겟이 자식인지 확인
  const isTargetChild = useMemo(() => {
    return (
      childComments.some((c) => c.id === targetHash) ||
      targetParentId === commentId
    );
  }, [childComments, targetHash, targetParentId, commentId]);

  // 4. 자동 열기 및 스크롤 핸들링
  useEffect(() => {
    if (!targetHash) return;

    const isTargetSelf = commentId === targetHash;

    if (!initialOpenRef.current) {
      if (!showReplies && (isTargetSelf || isTargetChild)) {
        setShowReplies(true);
      }
      if (isTargetSelf) initialOpenRef.current = true;
      if (isTargetChild && showReplies) initialOpenRef.current = true;
    }

    if (isTargetSelf || isTargetChild) {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        ref.current?.classList.add("bg-indigo-50", "ring-2", "ring-indigo-300");

        setTimeout(() => {
          ref.current?.classList.remove(
            "bg-indigo-50",
            "ring-2",
            "ring-indigo-300",
          );
        }, 2000);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [
    targetHash,
    commentId,
    showReplies,
    replyCount,
    isTargetChild,
    setShowReplies,
  ]);

  return { ref };
}
