import { supabase } from "@/utils/supabase/client";

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
    const filePath = `${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatar, { upsert: true });

    if (uploadError) throw uploadError;

    avatarUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
      .data.publicUrl;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname: nickname.trim(),
    avatar_url: avatarUrl,
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
    options: {
      redirectTo: window.location.href,
    },
  });

  if (error) throw error;
}
