import SignupForm from '@/app/_components/auth/signup-form'
import { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up page',
}
const SignupPage = () => {
  return (
    <div>
        <SignupForm />
    </div>
  )
}

export default SignupPage