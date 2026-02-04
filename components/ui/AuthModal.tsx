"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthActions } from "../auth/useAuthActions";

type Mode = "login" | "signup";

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const { login, signup, googleLogin } = useAuthActions();

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

  /* avatar preview */
  useEffect(() => {
    if (!avatar) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(avatar);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  /* modal mount */
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
        onClose();
        return;
      }

      await signup({
        email,
        password,
        nickname,
        avatar,
      });

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="bg-gray-100 p-6 rounded shadow-lg relative w-96 z-[10000]">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl mb-4 text-black">
          {mode === "login" ? "로그인" : "회원가입"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              {/* 프로필 이미지 */}
              <label
                htmlFor="avatar-upload"
                className="flex flex-col items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full border border-dashed cursor-pointer hover:bg-gray-50"
              >
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewUrl}
                    alt="프로필 이미지 미리보기"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <span className="text-sm text-gray-500">프로필 이미지</span>
                    <span className="text-xs text-gray-400">
                      클릭해서 업로드
                    </span>
                  </>
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

              {/* 닉네임 */}
              <input
                type="text"
                placeholder="닉네임"
                className="w-full mb-2 p-2 border"
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
            className="w-full mb-2 p-2 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full mb-2 p-2 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full mb-2 p-2 border"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={loading}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded mt-2"
          >
            {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded mt-2"
        >
          구글로 계속하기
        </button>

        <div className="mt-4 text-sm text-center text-gray-700">
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

        {error && <div className="text-red-500 mt-3 text-sm">{error}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
