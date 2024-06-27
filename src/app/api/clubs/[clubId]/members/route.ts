

import { backendClient } from "@/lib/edgestore-server";
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
                    where: {
                        NOT: {
                            isMentor: true
                        }
                    },
                    include: {
                        profile: true,
                        absences:{
                            include:{
                                schedule:true
                            }
                        }
                    }
                },
    
            }
        });
        return NextResponse.json({
            data,
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }
  
}

type Payload = {
    memberId:string
}
export async function POST(req: NextRequest,{ params }: { params: { clubId: string } }) {
    
    try {
        const { memberId }:Payload = await req.json();
       await db.club.update({
            where:{
                id:params.clubId
            },
            data:{
                members:{
                    disconnect:{
                        id:memberId
                    }
                }
            }
        });
        const userCertificate = await db.certificate.findUnique({
            where:{
                userId:memberId
            }
        });
        if(userCertificate) {
            await backendClient.publicFiles.deleteFile({
                url: userCertificate.file,
              });
            await db.certificate.delete({
                where:{
                    userId:memberId
                }
            })
        }

  
        return NextResponse.json({
            status:201,
            message:"Member Kicked"
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }
  
}
