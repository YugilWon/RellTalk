import { useState } from "react";
import * as authService from "@/app/lib/authservice";

export interface SignupParams {
  email: string;
  password: string;
  nickname: string;
  avatar: File | null;
}

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (params: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signIn(params.email, params.password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const unknownError = new Error("알 수 없는 오류가 발생했습니다.");
        setError(unknownError.message);
        throw unknownError;
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const unknownError = new Error("알 수 없는 오류가 발생했습니다.");
        setError(unknownError.message);
        throw unknownError;
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
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
