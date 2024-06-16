

import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
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
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }

}
