"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useAuthActions } from "../auth/useAuthActions";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!avatar) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(avatar);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [avatar]);

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
    setError(null);

    if (mode === "signup" && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email, password });
        router.refresh();
        onClose();
        return;
      }

      await signup({
        email,
        password,
        nickname,
        avatar,
      });
      router.refresh();
      alert("회원가입이 완료되었습니다.");
      setMode("login");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await googleLogin();
    } catch {
      setError("구글 로그인에 실패했습니다.");
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

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <label
                htmlFor="avatar-upload"
                className="flex flex-col items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full border border-dashed cursor-pointer hover:bg-gray-50 overflow-hidden"
              >
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewUrl}
                    alt="프로필 이미지 미리보기"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 text-xs sm:text-sm">
                    <span>프로필 이미지</span>
                    <span>클릭해서 업로드</span>
                  </div>
                )}

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                  disabled={loading}
                />
              </label>

              <input
                type="text"
                placeholder="닉네임"
                className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={loading}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="이메일"
            className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={loading}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base transition"
          >
            {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

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

        {error && (
          <div className="text-red-500 mt-3 text-sm text-center">{error}</div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
