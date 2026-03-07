"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";

interface ToolBarProps {
  editor: Editor;
  addImage: (file: File) => void;
}

export default function ToolBar({ editor, addImage }: ToolBarProps) {
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const buttonClass =
    "px-3 py-1 rounded text-sm border border-neutral-700 hover:bg-neutral-800";
  const activeClass = "bg-white text-black";

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (input.files && input.files[0]) {
        addImage(input.files[0]);
      }
    };
    input.click();
  };

  const insertYoutube = () => {
    if (!youtubeUrl) return;

    const videoId = youtubeUrl.split("v=")[1]?.split("&")[0];
    if (!videoId) return;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "youtube",
        attrs: {
          src: `https://www.youtube.com/embed/${videoId}`,
          width: 640,
          height: 360,
          controls: true,
        },
      })
      .run();

    setYoutubeUrl("");
    setYoutubeOpen(false);
  };

  const setColor = (color: string) => {
    editor.chain().focus().setMark("textStyle", { color }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 relative">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonClass} ${editor.isActive("bold") ? activeClass : ""}`}
      >
        Bold
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonClass} ${editor.isActive("italic") ? activeClass : ""}`}
      >
        Italic
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonClass} ${editor.isActive("heading", { level: 1 }) ? activeClass : ""}`}
      >
        H1
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonClass} ${editor.isActive("heading", { level: 2 }) ? activeClass : ""}`}
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonClass} ${editor.isActive("bulletList") ? activeClass : ""}`}
      >
        • List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${buttonClass} ${editor.isActive("orderedList") ? activeClass : ""}`}
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

      <button type="button" onClick={handleImageUpload} className={buttonClass}>
        Image
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setYoutubeOpen(!youtubeOpen)}
          className={buttonClass}
        >
          YouTube
        </button>

        {youtubeOpen && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-zinc-800 border rounded flex gap-1">
            <input
              type="text"
              placeholder="유튜브 링크 입력"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="px-2 py-1 w-64 bg-zinc-900 border rounded"
            />

            <button
              onClick={insertYoutube}
              type="button"
              className={`${buttonClass} px-2 py-1`}
            >
              Insert
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa", "#ffffff"].map(
          (c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-6 h-6 rounded border border-neutral-700"
              style={{ backgroundColor: c }}
            />
          ),
        )}
      </div>
    </div>
  );
}
