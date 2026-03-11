"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export function useNotifications(userId?: string) {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
    *,
    actor:profiles(nickname)
  `,
      )
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) {
      console.error("알림 조회 에러", error);
      return;
    }

    setNotifications(data || []);
    setCount(data?.length || 0);
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return { count, notifications, refetch: fetchNotifications };
}
