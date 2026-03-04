"use client";

import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileNickname from "./ProfileNickname";
import { useChangePassword } from "@/hooks/useChangePassword";
import PasswordInputBlack from "../common/PasswordInputBlack";
import { supabase } from "@/utils/supabase/client";

interface ProfileInfoProps {
  userId: string;
  nickname: string;
  avatarUrl: string;
  provider?: string;
}

export default function ProfileInfo({
  userId,
  nickname,
  avatarUrl,
  provider,
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

  const isGoogleLogin = provider !== "email";
  console.log(provider);

  return (
    <div className="max-w-2xl w-full mx-auto bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-white">
        내 정보
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-8 mb-12">
        <ProfileAvatar
          userId={userId}
          avatarUrl={currentAvatar}
          onAvatarChange={setCurrentAvatar}
        />

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-0">
              {currentNickname}
            </h3>

            <ProfileNickname
              userId={userId}
              nickname={currentNickname}
              onNicknameChange={setCurrentNickname}
            />
          </div>

          <p className="text-gray-400 text-sm">
            닉네임과 프로필 이미지를 변경할 수 있습니다. (이미지 클릭)
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 my-8" />

      {!isGoogleLogin ? (
        <section>
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6">
            비밀번호 변경
          </h3>

          <div className="space-y-4">
            <PasswordInputBlack
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="현재 비밀번호"
            />

            <PasswordInputBlack
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호"
            />

            <PasswordInputBlack
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호 확인"
            />

            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="w-full py-3 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500
                         text-white font-semibold transition-all duration-200
                         shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              {loading ? "변경 중..." : "비밀번호 변경하기"}
            </button>

            {message && (
              <p className="text-green-400 text-sm mt-2">{message}</p>
            )}
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        </section>
      ) : (
        <section className="p-4 bg-gray-800 rounded-md">
          <p className="text-gray-300 text-sm">
            이메일이 아닌 계정은 비밀번호를 변경할 수 없습니다.
          </p>
        </section>
      )}
    </div>
  );
}
