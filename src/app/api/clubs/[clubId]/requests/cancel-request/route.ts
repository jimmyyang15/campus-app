import { validateRequest } from "@/server/auth";
import { db } from "@/server/db"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest, {params}:{params:{clubId:string}}) {
    const user = await validateRequest()
    try {
        const request = await db.request.findFirst({
            where: {
                AND: [
                    {
                        clubId:params.clubId
                    }, {
                        userId:user?.id
                    }
                ]
            }
        })
        await db.request.delete({
            where: {
                id: request?.id
            }
        })
 

        return NextResponse.json({
            status: 201,
            message: "Request Cancelled"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}