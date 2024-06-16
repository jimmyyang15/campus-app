import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    recipientId: string;
    clubId: string
}
export async function POST(req: Request) {
    try {
        const { recipientId, clubId }:Payload = await req.json();
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        }
        if (!user.isMentor) {
            return NextResponse.json({
                error: "Forbidden"
            }, {
                status: 403
            })
        }
        await db.invitation.create({
            data: {
                recipientId,
                clubId,
                senderId: user?.id as string
            }
        })


        return NextResponse.json({
            status: 201,
            message: "Invitation Sent"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }


}