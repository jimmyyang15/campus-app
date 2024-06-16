import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { clubId: string } }) {
    try {
        const clubMembers = await db.club.findFirst({
            where: {
                id: params.clubId
            },
            select: {
                members: true
            }
        });
        const idMembers = clubMembers?.members.map((item) => item.id);
    
        const data = await db.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                            id: {
                                in: idMembers
                            }
                        }
    
                    }, {
                        NOT: {
                            isMentor: true
                        }
                    }, {
                        NOT: {
                            role: "ADMIN"
                        }
                    }, {
                        NOT: {
                            invitationReceived: {
                                clubId: params.clubId
                            }
                        }
                    }, {
                        club: null
                    }
                ]
    
            },
            include: {
                profile: true
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

