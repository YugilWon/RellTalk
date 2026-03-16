"use client";

import { useState } from "react";

export function useChangePassword() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = async () => {
    setError(null);
    setMessage(null);

    if (newPw !== confirmPw) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPw.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "비밀번호 변경 실패");
      }

      setMessage(data.message || "비밀번호가 변경되었습니다.");

      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
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
    currentPw,
    newPw,
    confirmPw,
    setCurrentPw,
    setNewPw,
    setConfirmPw,
    loading,
    message,
    error,
    handlePasswordChange,
  };
}
