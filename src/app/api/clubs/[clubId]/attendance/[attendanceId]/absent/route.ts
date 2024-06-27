import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

type Payload = {
    userId:string;
    scheduleId:string
}
export async function POST(req: NextRequest,{ params }: { params: { clubId: string,attendanceId:string } }) {
    const { userId }:Payload = await req.json() 
    try {
        await db.absence.create({
            data:{
                userId,
                scheduleId:params.attendanceId,
            }
        })
    
  
        return NextResponse.json({
            status:201,
            message:"Absent"
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }
  
}
