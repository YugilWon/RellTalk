import React, { useState, useEffect } from "react";
import LoginModal from "./loginModal";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./recoil/recoilState";
import jwt from "jsonwebtoken";

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [tokenExpiryAlert, setTokenExpiryAlert] = useState(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      console.log("토큰 만료 체크 함수 호출됨");
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          console.log("디코딩된 토큰:", decodedToken);

          if (decodedToken && decodedToken.exp * 1000 <= Date.now()) {
            localStorage.removeItem("token");
            handleLoginLogout();
            setTokenExpiryAlert(true);
            alert("토큰이 만료되어 로그아웃되었습니다.");
          }
        } catch (error) {
          console.error("토큰 디코딩 에러:", error.message);
          localStorage.removeItem("token");
          handleLoginLogout();
          setTokenExpiryAlert(true);
          alert("토큰이 만료되어 로그아웃되었습니다.");
        }
      }
    };

    checkTokenExpiry();
    const tokenExpiryCheckInterval = setInterval(checkTokenExpiry, 60000);

    return () => {
      clearInterval(tokenExpiryCheckInterval);
      console.log("토큰 만료 체크 인터벌이 정리되었습니다.");
    };
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
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
      {tokenExpiryAlert && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-2 text-center">
          토큰이 만료되어 로그아웃되었습니다.
        </div>
      )}
    </div>
  );
};

export default Login;
