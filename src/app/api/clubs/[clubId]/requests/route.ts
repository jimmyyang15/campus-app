import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const data =  await db.request.findMany({
            where: {
                clubId: params.clubId
            },
            include: {
                user: {
                    include: {
                        profile: true
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
export async function POST(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const user = await validateRequest();
        if (user?.isMentor || user?.role === "ADMIN") {

            return NextResponse.json({
                status: 403,
                message: "You're not supposed to request join"

            })
        }

        await db.request.create({
            data: {
                clubId: params.clubId,
                userId: user?.id as string
            }
        })
    
        return NextResponse.json({
            status:201,
            message:"Request sent"
        }) 
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }

}