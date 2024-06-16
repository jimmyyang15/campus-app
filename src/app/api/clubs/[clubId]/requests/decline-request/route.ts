

import { db } from "@/server/db"
import { NextRequest, NextResponse } from "next/server"

type Payload = {
    id:string;
}
export async function POST(req: NextRequest) {
    const { id }:Payload = await req.json()
    try {
        await db.request.delete({
            where: {
                id
            }
        })

 

        return NextResponse.json({
            status: 201,
            message: "Request declined"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}