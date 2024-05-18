
import RequestList from "@/app/_components/request/request-list";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import React from "react";

const RequestsPage = async({ params }:{params:{id:string}}) => {
    const { user } = await validateRequest();
    const { id } = params
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
  
      <RequestList  clubId={id as string}/>
    </main>
  );
};

export default RequestsPage;
