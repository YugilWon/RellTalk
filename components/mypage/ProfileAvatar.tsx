"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { compressImage } from "@/app/lib/compressImage";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string;
  onAvatarChange: (newUrl: string) => void;
}

export default function ProfileAvatar({
  userId,
  avatarUrl,
  onAvatarChange,
}: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setIsUploading(true);

    if (file.size > MAX_UPLOAD_SIZE) {
      alert("이미지는 5MB 이하만 업로드 가능합니다.");
      return;
    }

    try {
      const compressedFile = await compressImage(file);

      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      onAvatarChange(publicUrl);
    } catch (err) {
      console.error(err);
      alert("프로필 이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 cursor-pointer">
      <Image
        src={avatarUrl}
        alt="프로필 이미지"
        width={96}
        height={96}
        className="object-cover"
        onClick={() => document.getElementById("avatarInput")?.click()}
      />

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
          업로드 중...
        </div>
      )}

      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
    </div>
  );
}
