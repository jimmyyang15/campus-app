import { findPasswordToken } from '@/app/_actions/reset-password';
import ResetPasswordForm from '@/app/_components/auth/reset-password-form'
import { db } from '@/server/db';
import { notFound } from 'next/navigation';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import React from 'react'
import { isWithinExpirationDate } from "oslo";
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password page',
}
const ResetPassword = async({
    searchParams
}: {
    searchParams: { token: string };
  }) => {
    const { token } = searchParams;
    if (!token) {
      return notFound();
    }

    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
    const tokenExists = await findPasswordToken(tokenHash);

    if(!tokenExists ||  !isWithinExpirationDate(tokenExists.expiresAt) ) {
        return notFound()
    }

  return (
    <div>
        <ResetPasswordForm tokenHash={tokenHash} />

    </div>
  )
}

export default ResetPassword