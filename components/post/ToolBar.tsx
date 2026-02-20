"use client";

import { Editor } from "@tiptap/react";

interface ToolBarProps {
  editor: Editor;
}

export default function ToolBar({ editor }: ToolBarProps) {
  const buttonClass =
    "px-3 py-1 rounded text-sm border border-neutral-700 hover:bg-neutral-800";

  const activeClass = "bg-white text-black";

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonClass} ${
          editor.isActive("bold") ? activeClass : ""
        }`}
      >
        Bold
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonClass} ${
          editor.isActive("italic") ? activeClass : ""
        }`}
      >
        Italic
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonClass} ${
          editor.isActive("heading", { level: 1 }) ? activeClass : ""
        }`}
      >
        H1
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonClass} ${
          editor.isActive("heading", { level: 2 }) ? activeClass : ""
        }`}
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonClass} ${
          editor.isActive("bulletList") ? activeClass : ""
        }`}
      >
        • List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${buttonClass} ${
          editor.isActive("orderedList") ? activeClass : ""
        }`}
      >
        1. List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={buttonClass}
      >
        Undo
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className={buttonClass}
      >
        Redo
      </button>
    </div>
  );
}
