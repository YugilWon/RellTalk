"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useAuthActions } from "../auth/useAuthActions";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignUpForm";
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

      await signup({ email, password, nickname, avatar });
      toast.success("회원가입이 완료되었습니다.");
      onClose();
    } catch (err: any) {
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
    } catch {
      toast.error("구글 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
                    bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-md p-8 rounded-2xl
                   bg-[#0f0f0f]
                   border border-white/10
                   shadow-[0_0_60px_rgba(99,102,241,0.15)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white
                     text-2xl transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-8 tracking-wide">
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
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200
                     shadow-lg shadow-indigo-500/30
                     disabled:opacity-50"
        >
          구글로 계속하기
        </button>

        <div className="mt-6 text-center text-gray-400 text-sm">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있나요?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default AuthModal;
