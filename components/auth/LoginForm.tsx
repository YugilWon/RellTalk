"use client";

import PasswordInput from "../common/PasswordInput";

interface Props {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="이메일"
        className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={loading}
        required
      />

      <PasswordInput
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="비밀번호"
        disabled={loading}
        className="p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base transition"
      >
        {loading ? "처리 중..." : "로그인"}
      </button>
    </form>
  );
}
