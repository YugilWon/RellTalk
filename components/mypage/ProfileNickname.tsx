"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface ProfileNicknameProps {
  userId: string;
  nickname: string;
  onNicknameChange: (newNickname: string) => void;
}

export default function ProfileNickname({
  userId,
  nickname,
  onNicknameChange,
}: ProfileNicknameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);

  const handleUpdate = async () => {
    if (!newNickname.trim()) return alert("닉네임을 입력해주세요.");

    try {
      const { data: existing, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname", newNickname);
      if (error) throw error;
      if (existing?.length) return alert("이미 존재하는 닉네임입니다.");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ nickname: newNickname })
        .eq("id", userId);
      if (updateError) throw updateError;

      onNicknameChange(newNickname);
      setIsEditing(false);
      alert("닉네임이 변경되었습니다!");
    } catch (err) {
      console.error(err);
      alert("닉네임 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center mt-2">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="px-2 py-1 rounded text-black"
          />
          <button
            onClick={handleUpdate}
            className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            취소
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="ml-3 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          닉네임 수정
        </button>
      )}
    </div>
  );
}
