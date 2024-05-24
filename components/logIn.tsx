"use client";

import React, { useState } from "react";
import LoginModal from "./loginModal";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleLoginLogout}
        className="bg-gray-500 text-white px-4 py-2 rounded border border-gray-600 shadow-sm"
      >
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
      {isModalOpen && <LoginModal onClose={handleModalClose} />}
    </div>
  );
};

export default Login;
