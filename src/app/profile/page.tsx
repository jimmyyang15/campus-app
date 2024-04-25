import React from 'react'
import ProfileForm from '@/app/_components/profile/profile-form';
export const metadata = {
    title: "Profile",
    description: "This is the profile page",
    // icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
const ProfilePage = () => {
  return (
    <main className='container py-4 max-w-4xl mx-auto'>
        <ProfileForm />
    </main>
  )
}

export default ProfilePage