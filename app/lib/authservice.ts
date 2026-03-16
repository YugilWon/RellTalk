import { supabase } from "@/utils/supabase/client";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function signUp({
  email,
  password,
  nickname,
  avatar,
}: {
  email: string;
  password: string;
  nickname: string;
  avatar?: File | null;
}) {
  if (password.length < 8) {
    throw new Error("비밀번호는 최소 8자 이상이어야 합니다.");
  }

  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    throw new Error("닉네임을 입력해주세요.");
  }

  if (avatar) {
    if (avatar.size > MAX_FILE_SIZE) {
      throw new Error("이미지는 2MB 이하만 업로드 가능합니다.");
    }

    if (!ALLOWED_TYPES.includes(avatar.type)) {
      throw new Error("지원하지 않는 이미지 형식입니다.");
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("유저 생성 실패");

  let avatarUrl: string | null = null;

  if (avatar) {
    const ext = avatar.name.split(".").pop();

    const filePath = `${user.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar, {
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    avatarUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
      .data.publicUrl;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname: trimmedNickname,
    avatar_url: avatarUrl,
    email: user.email,
    provider: "email",
    role: "user",
  });

  if (profileError) {
    if (profileError.code === "23505") {
      throw new Error("이미 사용 중인 닉네임입니다.");
    }

    throw profileError;
  }
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + "/auth/callback" },
  });

  if (error) throw error;
}
