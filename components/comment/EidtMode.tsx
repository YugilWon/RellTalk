import React, { useState } from "react";
import { EditModeProps } from "@/types/interface";

function EditMode({ comment, updateMutation, setEditing }: EditModeProps) {
  const [editContent, setEditContent] = useState(comment.content);

  // 초기 멘션 추출 (있는 경우)
  const initialMention = comment.content.match(/^@\S+ /)?.[0] || "";

  const handleSave = () => {
    if (!window.confirm("댓글을 수정하시겠습니까?")) return;

    updateMutation.mutate(
      { id: comment.id, content: editContent },
      {
        onSuccess: () => {
          setEditing(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setEditing(false);
    setEditContent(comment.content);
  };

  return (
    <>
      <textarea
        value={editContent}
        onChange={(e) => {
          const newValue = e.target.value;
          // 초기 멘션이 있었을 경우 삭제 방지
          if (initialMention && !newValue.startsWith(initialMention)) {
            return;
          }
          setEditContent(newValue);
        }}
        className="w-full h-24 resize-none bg-neutral-800 rounded-lg p-3
                   text-xs md:text-sm text-gray-100 focus:outline-none"
      />

      <div className="flex gap-4 mt-2 text-[11px] md:text-xs text-gray-400">
        <button onClick={handleSave} className="hover:text-white transition">
          저장
        </button>

        <button onClick={handleCancel} className="hover:text-white transition">
          취소
        </button>
      </div>
    </>
  );
}

export default React.memo(EditMode);
