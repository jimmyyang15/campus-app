import SigninForm from "@/app/_components/auth/signin-form";
import BackgroundDot from "@/app/_components/ui/background-dot";
import { BackgroundGradient } from "@/app/_components/ui/background-gradient";
import { validateRequest } from "@/server/auth";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in page",
};
const SigninPage = async () => {
  noStore();
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <div>
      <SigninForm />
    </div>
  );
};

export default SigninPage;
