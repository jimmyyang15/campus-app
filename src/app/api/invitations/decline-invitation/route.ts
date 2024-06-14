import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    invitationId:string;
    clubId:string
}
export async function POST(req:Request) {


    const{invitationId}:Payload = await req.json();
    await db.invitation.delete({
        where:{
            id:invitationId
        }
    })
  

    return NextResponse.json({
        status:201,
        message:"Invitation Declined"
    })
}