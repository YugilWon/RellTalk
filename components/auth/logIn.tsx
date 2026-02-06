"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "./useAuth";
import AuthModal from "../ui/AuthModal";

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { session, loading } = useAuth();

  const isLoggedIn = !!session;

  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      await supabase.auth.signOut();
      window.location.reload();
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) return null;

  return (
    <div>
      <button
        onClick={handleLoginLogout}
        className="bg-gray-500 text-white px-4 py-2 rounded border border-gray-600 shadow-sm"
      >
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>

      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Login;
