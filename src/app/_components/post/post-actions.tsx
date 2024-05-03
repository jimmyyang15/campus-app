import React from 'react'
import ReactionPopover from './reaction-popover'

type Props = {
  postId:string;
}
const PostActions = ({ postId }:Props) => {
  return (
    <div className='flex gap-x-4 items-center'>
        <ReactionPopover postId={postId} />
    </div>
  )
}

export default PostActions