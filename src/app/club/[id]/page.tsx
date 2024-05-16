import React from "react";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
const ClubPage = async ({ params }: { params: { id: string } }) => {
  const { user } = await validateRequest();
  console.log(user);
  const clubMembers = await db.club.findFirst({
    where:{
      id:params.id
    },
    select:{
      members:true
    }
  });
  const memberOfClub = clubMembers?.members.find((member)=>member.id === user?.id);

  if(!memberOfClub) {
    return redirect("/");
  }
  return <main className="">
    
  </main>;
};

export default ClubPage;
