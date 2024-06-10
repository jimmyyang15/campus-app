import ForgetPasswordForm from "@/app/_components/auth/forget-password-form";

import { validateRequest } from "@/server/auth";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Forget password",
  description:"Forget password page",
};
const SigninPage = async () => {
  noStore();
  const  user  = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return (
    <div>
      <ForgetPasswordForm />
    </div>
  );
};

export default SigninPage;
