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

  // 2. 알림 타겟이 답글인 경우 조상(최상위 부모 및 직계 부모) 확인
  useEffect(() => {
    if (!targetHash) return;

    const checkAncestors = async () => {
      // 타겟 댓글의 정보를 가져옴
      const { data: targetComment } = await supabase
        .from("comments")
        .select("parent_id")
        .eq("id", targetHash)
        .single();

      if (!targetComment?.parent_id) return;

      // 1단계: 타겟의 직계 부모 설정
      setTargetParentId(targetComment.parent_id);

      // 2단계: 만약 타겟의 부모가 또 부모를 가지고 있다면 (2뎁스 이상의 답글인 경우)
      // 최상위 부모까지 찾아서 해당 부모 컴포넌트들도 목록을 열 수 있게 함
      const { data: parentComment } = await supabase
        .from("comments")
        .select("parent_id")
        .eq("id", targetComment.parent_id)
        .single();

      if (parentComment?.parent_id) {
        // 최상위 부모 ID를 추가로 저장하거나, 현재 컴포넌트가 최상위 부모인지 확인하기 위한 로직
        // 여기서는 targetParentId를 최상위 혹은 직계 부모 중 하나로 매칭되게 처리
        setTargetParentId((prev) =>
          prev === commentId || parentComment.parent_id === commentId
            ? commentId
            : prev,
        );

        // 현재 컴포넌트가 최상위 부모인 경우를 위해
        if (parentComment.parent_id === commentId) {
          setTargetParentId(commentId);
        }
      }
    };

    checkAncestors();
  }, [targetHash, commentId]);

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
