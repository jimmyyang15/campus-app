import { validateRequest } from "@/server/auth"
import { db } from "@/server/db"
import { NextRequest, NextResponse } from "next/server"

type Payload = {
    id:string;
    userId:string;
}
export async function POST(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const { id, userId }:Payload = await req.json()
        await db.request.delete({
            where: {
                id
            }
        })

        await db.club.update({
            where: {
                id: params.clubId
            },
            data: {
                members: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return NextResponse.json({
            status: 201,
            message: "Request accepted"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}