import React from 'react'
import ProfileForm from '@/app/_components/profile/profile-form';
import { validateRequest } from '@/server/auth';
export const metadata = {
    title: "Profile",
    description: "This is the profile page",
    // icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
const ProfilePage = async() => {

  return (
    <main className=' flex-[0.7] mx-auto p-4 flex flex-col '>
        <ProfileForm  />
    </main>
  )
}

export default ProfilePage