import React from 'react'
import ProfileForm from '@/app/_components/profile/profile-form';
import { validateRequest } from '@/server/auth';
export const metadata = {
    title: "Profile",
    description: "This is the profile page",
    // icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
const ProfilePage = async() => {
  const user  = await validateRequest();

  return (
    <main className='container py-4 max-w-4xl mx-auto flex flex-col '>
        <ProfileForm user={user} />
    </main>
  )
}

export default ProfilePage