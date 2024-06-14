import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await validateRequest()
    const data = await db.invitation.findMany({
        where:{
            recipientId:user?.id
        },
        include:{
            club:true,
            sender:{
                include:{
                    profile:true
                }
            }
        }
    })

    return NextResponse.json({
        data,
    })
}

