"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { useState } from "react";
import ToolBar from "./ToolBar";
import { useRouter } from "next/navigation";

export default function Write() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-400 underline",
        },
      }),

      Image.configure({
        allowBase64: true,
      }),

      Youtube.configure({
        controls: true,
        width: 640,
        height: 360,
      }),
    ],

    immediatelyRender: false,
  });

  if (!editor) return null;

  const handleSubmit = async () => {
    if (!editor) return;

    const content = editor.getHTML();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`저장 실패: ${errorData.error ?? res.statusText}`);
        return;
      }

      const data = await res.json();
      const newPostId = data[0]?.id;

      if (newPostId) {
        alert("저장 완료");
        router.push(`/post/${newPostId}`);
      } else {
        alert("저장 후 ID를 가져오지 못했습니다.");
      }
    } catch (err) {
      console.error("게시글 저장 중 오류:", err);
      alert("게시글 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-8">게시글 작성</h1>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-white"
      />

      <ToolBar editor={editor} />

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-white text-black py-3 rounded-lg font-semibold hover:opacity-80 transition"
      >
        등록하기
      </button>
    </div>
  );
}
