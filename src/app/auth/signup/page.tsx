import SignupForm from '@/app/_components/auth/signup-form'
import { unstable_noStore as noStore } from "next/cache";

import { validateRequest } from '@/server/auth'
import { Metadata } from 'next'
import React from 'react'
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up page',
}
const SignupPage = async() => {
  noStore();
  const { user } = await validateRequest();
	if (user) {
		return redirect("/");
	}
  return (
    <div>
        <SignupForm />
    </div>
  )
}

export default SignupPage