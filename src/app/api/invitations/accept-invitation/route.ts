import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    invitationId:string;
    clubId:string
}
export async function POST(req:Request) {


    const{invitationId,clubId}:Payload = await req.json();
    const user = await validateRequest()
    await db.invitation.delete({
        where:{
            id:invitationId
        }
    })
  await db.club.update({
        where:{
            id:clubId
        },
        data:{
            members:{
                connect:{
                    id:user?.id
                }
            }
        }
    })

    return NextResponse.json({
        status:201,
        message:"Invitation Accepted"
    })
}