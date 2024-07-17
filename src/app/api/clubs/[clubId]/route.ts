import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    
    try {
        const data =  await db.club.findFirst({
            where: {
                id:params.clubId
            },
            include: {
                members: {
                    include: {
                        profile: true,
                        submissions:true
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

export async function DELETE(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const user = await validateRequest();
        if (user?.role !== "ADMIN") {

            return NextResponse.json({
                status: 403,
                message: "You're not supposed to use this resource"

            })
        }

        await db.club.delete({
            where: {
                id:params.clubId
            }
        })

 

        return NextResponse.json({
            status: 201,
            message: "Club deleted"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}