"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const authStatus = searchParams.get("auth");

    if (!authStatus) return;

    if (authStatus === "success") {
      toast.success("회원가입이 완료되었습니다 🎉");
    }

    if (authStatus === "error") {
      toast.error("인증 처리 중 문제가 발생했습니다.");
    }

    router.replace("/", { scroll: false });
  }, [searchParams, router]);

  return null;
}
