"use client";
import React from "react";

import SideBar from "@/components/sideBar";
import useTokenExpiryCheck, {
  TokenExpiryAlert,
} from "@/components/tokenExpireCheck";

export default function MainPage() {
  const { tokenExpiryAlert, handleAlertClose } = useTokenExpiryCheck();
  return (
    <>
      <SideBar />
      {tokenExpiryAlert && <TokenExpiryAlert onClose={handleAlertClose} />}
    </>
  );
}
