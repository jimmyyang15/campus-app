import SigninForm from "@/app/_components/auth/signin-form";

import { validateRequest } from "@/server/auth";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in page",
};
const SigninPage = async () => {
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
