
import SigninForm from "@/app/_components/auth/signin-form";
import BackgroundDot from "@/app/_components/ui/background-dot";
import { BackgroundGradient } from "@/app/_components/ui/background-gradient";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in page',
}
const SigninPage = () => {
  return (
    <div>
   <SigninForm />
    </div>
  );
};

export default SigninPage;
