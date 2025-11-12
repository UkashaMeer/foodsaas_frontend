"use client"

import RegisterForm from "@/components/auth/RegisterForm";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import HomePageComponent from "@/components/home/HomePageComponent";

export default function Home() {
  return (
    <>
      <RegisterForm />
      <VerifyEmailForm />
      <HomePageComponent />
    </>
  );
}
