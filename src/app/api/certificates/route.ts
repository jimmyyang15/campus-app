import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const clubId = await req.json()
    const data =  await db.club.findUnique({
        where: {
            id: clubId as string
        },
        select: {
            members: {
                include: {
                    profile: true
                },
                
                where:{
                    AND:[
                        {
                            certificate:{
                                is:null
                            }
                        },
                        {
                            isMentor:false
                        }
                    ]
                 
                }
            }
        }
    })

    return NextResponse.json({
        data,
    })
}