import React from 'react'
import AvatarProfile from '../avatar-profile'
import { useSession } from '../session-provider'
import { Comment, Profile } from '@prisma/client'
import { CommentWithUser } from '@/types'
import moment from 'moment'

type Props = {
    comment:CommentWithUser;
}
const CommentComponent = ({ comment }:Props) => {
  return (
    <div className='space-y-4'>
        <div className="flex items-center gap-x-2">
            <AvatarProfile profile={comment?.user?.profile as Profile}/>
            <p className='font-semibold'>{comment.user?.profile?.fullName}</p>
            <p className='text-gray-500 text-xs'>●</p>
            <p className='text-sm text-gray-500'>commented {moment(comment.createdAt, "YYYYMMDD").fromNow()}</p>
        </div>
        <p>
            {comment.text}
        </p>
    </div>
  )
}

export default CommentComponent