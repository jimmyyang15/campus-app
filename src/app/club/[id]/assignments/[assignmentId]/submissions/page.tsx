import SubmissionList from '@/app/_components/submissions/submission-list';
import { validateRequest } from '@/server/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const SubmissionsPage = async() => {
    const { user } =await validateRequest();

    if(!user?.isMentor) {
        return redirect("/")
    }
    
  return (
    <div>
      <SubmissionList />
    </div>
  )
}

export default SubmissionsPage