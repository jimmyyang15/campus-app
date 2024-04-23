import React from 'react'
import CreatePostForm from '@/app/_components/create-post/create-post-form'
import { validateRequest } from '@/server/auth';
import { redirect } from 'next/navigation';

const CreatePostPage = async() => {

  const { user } = await validateRequest();

    if(user?.role!=="ADMIN") {
        return redirect("/")
    }

  return (
    <main className='max-w-3xl mx-auto p-4 border-x '>
        <p className='text-xl font-semibold'>Create a post</p>
        <CreatePostForm />
    </main>
  )
}

export default CreatePostPage