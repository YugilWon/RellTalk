import { useState } from "react";
import * as authService from "@/app/lib/authservice";
import { supabase } from "@/utils/supabase/client";

export interface SignupParams {
  email: string;
  password: string;
  nickname: string;
  avatar: File | null;
}

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signIn(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({
    email,
    password,
    nickname,
    avatar,
  }: SignupParams) => {
    let avatarUrl: string | null = null;

    if (avatar) {
      const filePath = `public/${crypto.randomUUID()}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar);

      if (error) throw error;

      avatarUrl = supabase.storage.from("avatars").getPublicUrl(data.path)
        .data.publicUrl;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          nickname,
          avatar_url: avatarUrl,
        },
      },
    });

    if (error) throw error;

    await supabase.auth.signOut();
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
    signup,
    googleLogin,
  };
}
