import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

type Payload = {
    dateTime:Date,
    title:string
}
export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const data = await db.schedule.findMany({
            where:{
                clubId:params.clubId
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


export async function POST(req: NextRequest,{ params }: { params: { clubId: string } }) {
    const { dateTime,title }:Payload = await req.json() 
    try {
        await db.schedule.create({
            data:{
                clubId:params.clubId,
                date:dateTime,
                title
            }
        })
    
  
        return NextResponse.json({
            status:201,
            message:"Schedule created"
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }
  
}
