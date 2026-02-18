"use client";

import React, { useEffect, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import { fetchUser } from "@/app/lib/user";
import { getProfileInfo } from "@/app/lib/profileinfo";

const tabs = ["내 정보", "내가 좋아하는 영화", "내 댓글"];

export default function MyPageLayOut() {
  const [activeTab, setActiveTab] = useState("내 정보");
  const [profile, setProfile] = useState<{
    nickname: string | null;
    avatarUrl: string | null;
  } | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await fetchUser();
        if (!user) {
          alert("로그인이 필요합니다.");
          setLoading(false);
          return;
        }
        setUser(user);

        const profileData = await getProfileInfo(user.id);
        setProfile(profileData);
      } catch (err) {
        console.error(err);
        alert("프로필을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>불러오는 중...</div>;
  if (!profile) return <div>프로필을 불러올 수 없습니다.</div>;

  return (
    <div>
      <div className="flex space-x-4 mb-8 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 -mb-px font-medium border-b-2
              ${activeTab === tab ? "border-indigo-500 text-white" : "border-transparent text-gray-400"}
              transition-colors duration-200`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "내 정보" && user && profile && (
          <ProfileInfo
            userId={user.id}
            nickname={profile.nickname ?? "닉네임을 설정해주세요"}
            avatarUrl={profile.avatarUrl ?? "/default-avatar.png"}
          />
        )}
        {/* {activeTab === "좋아요 영화" && <LikedMovies />}
        {activeTab === "내 댓글" && <MyComments />} */}
      </div>
    </div>
  );
}
