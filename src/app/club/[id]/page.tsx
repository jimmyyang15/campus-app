import React from "react";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import ClubHome from "@/app/_components/clubs/club-home";

const ClubPage = async ({ params }: { params: { id: string } }) => {
  const user  = await validateRequest();
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
    {/* <SendNotificationBtn /> */}
    <ClubHome />
  </main>;
};

export default ClubPage;
