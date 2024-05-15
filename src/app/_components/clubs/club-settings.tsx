import { ClubWithPayload, UserWithProfile } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InviteModal from './invite-modal'
import MembersModal from './members-modal'

const ClubSettings = ({ club }:{club:ClubWithPayload}) => {
  return (
    <div className='flex flex-col gap-y-2 items-center'>
      <p className="text-center text-xl font-bold ">{club?.name}</p>
      <Image src={club.clubImage} alt="club profile image" width={150} height={150} sizes='100vw' className='rounded-full' />
      <p className='text-gray-500'>{club.members.length} members</p>
      <ul className='text-gray-500 space-y-4 self-start'>
        <InviteModal  />
        <MembersModal members={club.members as UserWithProfile[]} />
      </ul>
    </div>
  )
}

export default ClubSettings