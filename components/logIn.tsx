import React, { useState } from "react";
import LoginModal from "./loginModal";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./recoil/recoilState";

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      <button
        onClick={handleLoginLogout}
        className="bg-gray-500 text-white px-4 py-2 rounded border border-gray-600 shadow-sm"
      >
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
      {isModalOpen && (
        <LoginModal
          onClose={handleModalClose}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Login;
