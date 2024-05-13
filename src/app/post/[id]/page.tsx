import PostDetailComponent from '@/app/_components/post/post-detail';
import React from 'react'

const PostDetail = ({ params }: { params: { id: string } }) => {
    const { id } = params;
  return (
    <main className='container'>
        <PostDetailComponent id={id} />
    </main>
  )
}

export default PostDetail