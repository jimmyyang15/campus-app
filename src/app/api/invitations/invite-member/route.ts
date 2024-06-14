import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    invitationId:string;
    clubId:string
}
export async function POST(req:Request) {


    const { recipientId,clubId } = await req.json();
    const user = await validateRequest()
    await db.invitation.create({
        data:{
            recipientId,
            clubId,
            senderId:user?.id as string
        }
    })
  

    return NextResponse.json({
        status:201,
        message:"Invitation Sent"
    })
}