
import ChangePasswordForm from '@/app/_components/account/change-password-form'
import React from 'react'

const ChangePasswordPage = () => {
  return (
    <main className='p-4 flex-1 md:flex-[0.7]'>
        <h5>Change your password</h5>
        <ChangePasswordForm />
    </main>
  )
}

export default ChangePasswordPage