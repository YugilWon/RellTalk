"use client";

import NotificationBell from "@/components/notification/NotificationBell";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Notification() {
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id);
    };

    getUser();
  }, []);

  return <NotificationBell userId={userId} />;
}
