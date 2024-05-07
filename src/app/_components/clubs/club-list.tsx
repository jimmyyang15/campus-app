"use client"

import { Club } from '@prisma/client'
import React from 'react'
import ClubItem from './club-item'
import { api } from '@/trpc/react'

const ClubList = () => {
  const { data:clubs } = api.club.getClubs.useQuery()

  return (
    <div className='grid grid-cols-2 '>
        {clubs?.map((club,i)=>(
            <ClubItem key={i} club={club as Club} />
        ))}
    </div>
  )
}

export default ClubList