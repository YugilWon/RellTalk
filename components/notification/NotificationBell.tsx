"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/interface";

export default function NotificationBell({ userId }: { userId?: string }) {
  const { count, notifications, refetch } = useNotifications(userId);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notification.id);

    refetch();
    setOpen(false);

    if (notification.target_type === "movie") {
      router.push(
        `/detail/${notification.post_id}#comment-${notification.comment_id}`,
      );
    } else {
      router.push(
        `/post/${notification.post_id}#comment-${notification.comment_id}`,
      );
    }
  };

  return (
    <div ref={ref} className="fixed top-5 right-14 z-50">
      <div
        className="relative text-xl cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        🔔
        {count > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
            {count}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">알림이 없습니다</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`text-sm p-2 text-black rounded cursor-pointer hover:bg-gray-100 ${
                  !n.is_read ? "bg-gray-50 font-semibold" : ""
                }`}
              >
                {n.type === "comment" &&
                  `${n.actor?.nickname ?? "누군가"}님이 댓글을 남겼습니다`}

                {n.type === "reply" &&
                  `${n.actor?.nickname ?? "누군가"}님이 답글을 남겼습니다`}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
