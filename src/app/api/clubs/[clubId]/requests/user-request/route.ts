import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const user = await validateRequest()
        const data = await db.request.findFirst({
            where:{
                userId:user?.id
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