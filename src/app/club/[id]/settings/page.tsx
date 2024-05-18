import ClubSettings from "@/app/_components/clubs/club-settings";

import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

import React from "react";

const SettingsClubPage = async ({
  params,
}: {
  params: { id:string };
}) => {
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

  return (
    <main>
      <ClubSettings />
    </main>
  );
};

export default SettingsClubPage;
