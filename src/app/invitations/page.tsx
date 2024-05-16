import React from 'react'
import InvitationsList from '@/app/_components/invitation/invitations-list'

const InvitationsPage = () => {
  return (
    <main className='max-w-2xl p-4 mx-auto border-x h-screen'>
        <p className='text-center text-xl font-bold'>Invitations</p>
        <InvitationsList />
    </main>
  )
}

export default InvitationsPage