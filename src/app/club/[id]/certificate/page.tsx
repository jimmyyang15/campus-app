
import React from 'react'

import CertificateComponent from '@/app/_components/certificate/certificate-component'
import { validateRequest } from '@/server/auth';
import { db } from '@/server/db';
import { redirect } from 'next/navigation';
const CertificatePage = async({ params }:{params:{id:string}}) => {
  const user = await validateRequest();
  const clubMembers = await db.club.findFirst({
    where:{
      id:params.id
    },
    select:{
      members:true
    }
  });
  const memberOfClub = clubMembers?.members.find((member)=>member.id === user?.id);
  const mentor = clubMembers?.members.find((member)=>member.isMentor);
  if(!memberOfClub && mentor?.id === user?.id) {
    return redirect("/");
  }
  return (
    <div>
      <CertificateComponent />
    </div>
  )
}

export default CertificatePage