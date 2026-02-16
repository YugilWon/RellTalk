"use client";
import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileNickname from "./ProfileNickname";

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

  return (
    <div className="max-w-xl mx-auto bg-gray-800/40 rounded-2xl p-6 shadow-inner">
      <h2 className="text-2xl font-bold mb-6 text-white">내 정보</h2>

      <div className="flex items-center space-x-6">
        <ProfileAvatar
          userId={userId}
          avatarUrl={currentAvatar}
          onAvatarChange={setCurrentAvatar}
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">
            {currentNickname}
          </h3>
          <ProfileNickname
            userId={userId}
            nickname={currentNickname}
            onNicknameChange={setCurrentNickname}
          />
          <p className="text-gray-400 mt-1">프로필을 변경할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
