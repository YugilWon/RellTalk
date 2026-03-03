"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/?auth=error");
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
            router.replace("/?auth=error");
            return;
          }
        }

        router.replace("/?auth=success");
      } catch (err) {
        router.replace("/?auth=error");
      }
    };

    handleAuth();
  }, [router]);

  return <p className="text-center mt-10">가입 처리 중...</p>;
}
