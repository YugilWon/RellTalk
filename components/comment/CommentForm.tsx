"use client";

import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isPending?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  onSubmit,
  isPending,
  placeholder = "댓글을 입력하세요",
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");

  return (
    <div className="bg-neutral-900 rounded-xl p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus={autoFocus}
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
