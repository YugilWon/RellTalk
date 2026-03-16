"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PasswordInput from "../common/PasswordInput";
import { compressImage } from "@/app/lib/compressImage";

interface Props {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  avatar: File | null;
  loading: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onPasswordConfirmChange: (v: string) => void;
  onNicknameChange: (v: string) => void;
  onAvatarChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignupForm({
  email,
  password,
  passwordConfirm,
  nickname,
  avatar,
  loading,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onNicknameChange,
  onAvatarChange,
  onSubmit,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    if (!avatar) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(avatar);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      onAvatarChange(null);
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      alert("이미지는 5MB 이하만 업로드 가능합니다.");
      return;
    }

    const compressedFile = await compressImage(file);

    if (compressedFile.size > MAX_FILE_SIZE) {
      alert("파일 사이즈가 너무 큽니다.");
      return;
    }

    onAvatarChange(compressedFile);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label
        htmlFor="avatar-upload"
        className="relative flex flex-col items-center justify-center 
             w-24 h-24 mx-auto mb-4 rounded-full 
             border border-dashed cursor-pointer 
             hover:bg-gray-50 overflow-hidden"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="프로필 이미지 미리보기"
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-gray-500 text-xs sm:text-sm text-center">
            프로필 이미지
            <br />
            클릭해서 업로드
          </div>
        )}

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={loading}
        />
      </label>

      <input
        type="text"
        placeholder="닉네임"
        className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        value={nickname}
        onChange={(e) => onNicknameChange(e.target.value)}
        disabled={loading}
        required
      />

      <input
        type="email"
        placeholder="이메일"
        className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={loading}
        required
      />

      <PasswordInput
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="비밀번호"
        disabled={loading}
        className="p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
      />

      <PasswordInput
        value={passwordConfirm}
        onChange={(e) => onPasswordConfirmChange(e.target.value)}
        placeholder="비밀번호 확인"
        disabled={loading}
        className="p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base transition"
      >
        {loading ? "처리 중..." : "회원가입"}
      </button>
    </form>
  );
}
