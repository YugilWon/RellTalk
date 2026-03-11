"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useState } from "react";
import ToolBar from "./ToolBar";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { addImage, handleSubmit } from "./post";
import { Post } from "@/(types)/interface";
import { FontSize } from "./FontSize";

interface Props {
  post?: Post;
}

export default function Write({ post }: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userQuery = useUser();
  const user = userQuery.data;
  const isLoading = userQuery.isLoading;
  const router = useRouter();
  const [pendingImages, setPendingImages] = useState<
    { file: File; tempUrl: string }[]
  >([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { class: "text-blue-400 underline" },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "w-full max-w-full h-auto rounded-lg my-4",
        },
      }),
      Youtube.configure({
        controls: true,
        HTMLAttributes: {
          class: "w-full aspect-[16/9] rounded-lg my-4",
        },
      }),
    ],
    content: post?.content ?? "",
    immediatelyRender: false,
  });

  if (isLoading || !editor) return <div>로딩 중...</div>;
  if (!user)
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-white">
        <p className="text-center text-gray-300 text-lg">
          글을 작성하려면 로그인이 필요합니다.
        </p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-8">
        {post ? "글 수정" : "게시글 작성"}
      </h1>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-white"
      />

      <ToolBar
        editor={editor}
        addImage={(file) => addImage(file, editor, setPendingImages)}
      />

      <div
        className=" border
       border-neutral-700
        rounded
        p-4
        h-[400px]
        overflow-y-auto
        cursor-text"
      >
        <EditorContent
          editor={editor}
          className="
          border
          border-neutral-700
          rounded
          p-4
          min-h-[400px]
          cursor-text
        "
        />
      </div>

      <button
        onClick={async () => {
          const success = await handleSubmit(
            title,
            editor,
            pendingImages,
            setIsSubmitting,
            router,
            post?.id,
          );

          if (success) {
            pendingImages.forEach((img) => URL.revokeObjectURL(img.tempUrl));

            setPendingImages([]);
          }
        }}
        disabled={isSubmitting}
        className={`mt-6 w-full py-3 rounded-lg font-semibold transition
          ${
            isSubmitting
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-white text-black hover:opacity-80"
          }`}
      >
        {isSubmitting ? "저장 중..." : post ? "수정하기" : "등록하기"}
      </button>
    </div>
  );
}
