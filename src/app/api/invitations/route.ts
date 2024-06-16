import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        }
        const data = await db.invitation.findMany({
            where: {
                recipientId: user?.id
            },
            include: {
                club: true,
                sender: {
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
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}

