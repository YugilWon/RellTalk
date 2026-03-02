"use client";

import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileNickname from "./ProfileNickname";
import PasswordInput from "@/components/common/PasswordInput";
import { useChangePassword } from "@/hooks/useChangePassword";

interface ProfileInfoProps {
  userId: string;
  nickname: string;
  avatarUrl: string;
}

export default function ProfileInfo({
  userId,
  nickname,
  avatarUrl,
}: ProfileInfoProps) {
  const [currentNickname, setCurrentNickname] = useState(nickname);
  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl);

  const {
    currentPw,
    newPw,
    confirmPw,
    setCurrentPw,
    setNewPw,
    setConfirmPw,
    loading,
    message,
    error,
    handlePasswordChange,
  } = useChangePassword();

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-10 text-white">내 정보</h2>

      <div className="flex items-start space-x-8 mb-12">
        <ProfileAvatar
          userId={userId}
          avatarUrl={currentAvatar}
          onAvatarChange={setCurrentAvatar}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-semibold text-white">
              {currentNickname}
            </h3>

            <ProfileNickname
              userId={userId}
              nickname={currentNickname}
              onNicknameChange={setCurrentNickname}
            />
          </div>

          <p className="text-gray-400 text-sm">
            닉네임과 프로필 이미지를 변경할 수 있습니다.(이미지 클릭)
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 my-8" />

      <section>
        <h3 className="text-xl font-semibold text-white mb-6">
          🔒 비밀번호 변경
        </h3>

        <div className="space-y-4">
          <PasswordInput
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="현재 비밀번호"
          />

          <PasswordInput
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="새 비밀번호"
          />

          <PasswordInput
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="새 비밀번호 확인"
          />

          <button
            onClick={handlePasswordChange}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500
                       text-white font-semibold transition-all duration-200
                       shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
          >
            {loading ? "변경 중..." : "비밀번호 변경하기"}
          </button>

          {message && <p className="text-green-400 text-sm mt-2">{message}</p>}

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </section>
    </div>
  );
}
