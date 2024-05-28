import React from "react";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import SendNotificationBtn from "@/app/_components/clubs/send-notification";

const ClubPage = async ({ params }: { params: { id: string } }) => {
  const { user } = await validateRequest();
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
    <SendNotificationBtn />
    
  </main>;
};

export default ClubPage;
