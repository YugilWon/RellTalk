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

  const signup = async (params: {
    email: string;
    password: string;
    nickname: string;
    avatar?: File | null;
  }) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signUp(params);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
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
