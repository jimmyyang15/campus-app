import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { mentorId, signatureUrl } = await req.json()

        const user = await validateRequest()
        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        }



        await db.user.update({
            where: {
                id: mentorId
            }, data: {
                signature: signatureUrl
            }
        })


        return NextResponse.json({
            status: 201,
            message: "Signature uploaded"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}
