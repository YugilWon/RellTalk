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
        error: userError,
      } = await supabase.auth.getUser();

      if (!user) {
        console.error(userError);
        return;
      }

      try {
        const { data: existingProfile, error: selectError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (selectError && selectError.code !== "PGRST116") {
          console.error(selectError);
          return;
        }

        if (!existingProfile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              nickname: user.user_metadata?.full_name ?? null,
              avatar_url: user.user_metadata?.avatar_url ?? null,
              email: user.email,
              provider: "google",
              role: "user",
            });

          if (insertError) console.error(insertError);
        }
      } catch (err) {
        console.error(err);
      }

      router.replace("/");
    }

    init();
  }, []);

  return <div>로그인 처리 중...</div>;
}
