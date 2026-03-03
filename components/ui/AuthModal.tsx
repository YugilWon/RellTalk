"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useAuthActions } from "../auth/useAuthActions";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignIUpForm";
import toast from "react-hot-toast";

type Mode = "login" | "signup";

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const { login, signup, googleLogin } = useAuthActions();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup" && password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email, password });
        toast.success("로그인 성공 🎉");
        onClose();
        router.refresh();
        return;
      }

      await signup({
        email,
        password,
        nickname,
        avatar,
      });

      toast.success("이메일을 확인해주세요 📩");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await googleLogin();
      toast.success("로그인 성공 🎉");
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error("구글 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 sm:p-0">
      <div className="bg-gray-100 rounded shadow-lg w-full max-w-md sm:w-96 p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-700 text-xl sm:text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
          {mode === "login" ? "로그인" : "회원가입"}
        </h2>

        {mode === "login" ? (
          <LoginForm
            email={email}
            password={password}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        ) : (
          <SignupForm
            email={email}
            password={password}
            passwordConfirm={passwordConfirm}
            nickname={nickname}
            avatar={avatar}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onPasswordConfirmChange={setPasswordConfirm}
            onNicknameChange={setNickname}
            onAvatarChange={setAvatar}
            onSubmit={handleSubmit}
          />
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base transition"
        >
          구글로 계속하기
        </button>

        <div className="mt-4 text-center text-gray-700 text-xs sm:text-sm">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("signup")}
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있나요?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("login")}
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
