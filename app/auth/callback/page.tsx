"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user) {
        console.error(error);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        nickname: user.user_metadata?.full_name ?? null,
        avatar_url: null,
        email: user.email,
        provider: "google",
        role: "user",
      });

      if (profileError) console.error(profileError);

      router.replace("/");
    }

    init();
  }, []);

  return <div>로그인 처리 중...</div>;
}
