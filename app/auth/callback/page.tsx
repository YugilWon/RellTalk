"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("인증 처리 중 문제가 발생했습니다.");
          router.replace("/");
          return;
        }

        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (!existingProfile) {
          const { error } = await supabase.from("profiles").insert({
            id: user.id,
            nickname: user.user_metadata?.nickname ?? "익명",
            avatar_url: user.user_metadata?.avatar_url ?? null,
          });

          if (error) {
            toast.error("인증 처리 중 문제가 발생했습니다.");
            router.replace("/");
            return;
          }
        }

        toast.success("회원가입이 완료되었습니다!");
        router.replace("/");
      } catch (err) {
        toast.error("인증 처리 중 문제가 발생했습니다.");
        router.replace("/");
      }
    };

    handleAuth();
  }, [router]);

  return <p className="text-center mt-10">가입 처리 중...</p>;
}
