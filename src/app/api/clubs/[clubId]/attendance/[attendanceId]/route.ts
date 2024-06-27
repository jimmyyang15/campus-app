import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string,attendanceId:string } }) {
    try {
        const data = await db.schedule.findUnique({
            where:{
                id:params.attendanceId
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
