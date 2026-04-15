"use client";

import { useState, useRef, useEffect } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isPending?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
}

export default function CommentForm({
  onSubmit,
  isPending,
  placeholder = "댓글을 입력하세요",
  autoFocus = false,
  initialValue = "",
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 백스페이스 감지
    if (e.key === "Backspace" && initialValue && content === initialValue) {
      // 태그가 초기값과 일치할 때 지우려고 하면 전체 삭제 (또는 유지)
      // 여기서는 유저가 지우기 불편하게 아예 막거나, 한 번에 지워지게 할 수 있습니다.
      // 일단 유저의 피드백대로 '지워버릴 수 있는' 문제를 방지하기 위해
      // 초기 태그 영역은 유지하거나 특별 처리를 할 수 있습니다.
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-4">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          const newValue = e.target.value;
          // 초기 태그(@닉네임 )가 삭제되지 않도록 보호 (선택적)
          if (initialValue && !newValue.startsWith(initialValue)) {
            return;
          }
          setContent(newValue);
        }}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        placeholder={placeholder}
        className="w-full h-28 resize-none bg-neutral-800 rounded-lg p-4 text-sm
        text-gray-100 placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={() => {
            if (!content.trim()) return;
            onSubmit(content);
            setContent("");
          }}
          disabled={!content.trim() || isPending}
          className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-500
          text-sm font-semibold transition disabled:opacity-50"
        >
          등록
        </button>
      </div>
    </div>
  );
}
