import React from 'react'
import UserCertificate from '../_components/certificate/user-certificate'
import { validateRequest } from '@/server/auth';
import { redirect } from 'next/navigation';

const CertificatePage = async() => {
  const user  = await validateRequest();

  if (user?.role !== "" || user.isMentor) {
    return redirect("/");
  }

  return (
    <main className='p-4'>
        <UserCertificate />
    </main>
  )
}

export default CertificatePage