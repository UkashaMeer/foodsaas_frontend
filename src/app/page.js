"use client"

import RegisterForm from "@/components/auth/RegisterForm";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import CartSidebar from "@/components/cart/CartSidebar";
import HomePageComponent from "@/components/home/HomePageComponent";
import { useAuthDialogState } from "@/store/useAuthDialogState";
import { useEffect } from "react";

export default function Home() {
  const {checkAuth} = useAuthDialogState()

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  return (
    <>
      <RegisterForm />
      <VerifyEmailForm />
      <HomePageComponent />
      <CartSidebar />
    </>
  );
}
