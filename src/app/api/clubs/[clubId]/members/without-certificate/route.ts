

import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    const data = await db.club.findUnique({
        where: {
            id: params.clubId
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
