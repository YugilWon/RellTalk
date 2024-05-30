import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoggedInState, tokenState } from "./recoil/recoilState";
import jwt from "jsonwebtoken";

const useTokenExpiryCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [, setToken] = useRecoilState(tokenState);
  const [tokenExpiryAlert, setTokenExpiryAlert] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decodedToken = jwt.decode(savedToken);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        setToken(savedToken);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, [setToken, setIsLoggedIn]);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwt.decode(token);

          if (decodedToken && decodedToken.exp * 1000 <= Date.now()) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setTokenExpiryAlert(true);
          }
        } catch (error) {
          console.error("토큰 디코딩 에러:", error.message);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setTokenExpiryAlert(true);
        }
      }
    };

    checkTokenExpiry();
    const tokenExpiryCheckInterval = setInterval(checkTokenExpiry, 60000);

    return () => {
      clearInterval(tokenExpiryCheckInterval);
    };
  }, [setIsLoggedIn]);

  const handleAlertClose = () => {
    setTokenExpiryAlert(false);
  };

  return { tokenExpiryAlert, handleAlertClose };
};

const TokenExpiryAlert = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="absolute top-0 left-0 right-0 bg-red-500 text-white py-2 text-center cursor-pointer"
    >
      토큰이 만료되어 로그아웃되었습니다.
    </div>
  );
};

export default useTokenExpiryCheck;
export { TokenExpiryAlert };
