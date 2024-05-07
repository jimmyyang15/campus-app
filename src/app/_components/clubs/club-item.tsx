import { Club } from '@prisma/client'
import React from 'react'

const ClubItem = ({club}:{club:Club}) => {
  return (
    <div>
        {club.name}
    </div>
  )
}

export default ClubItem