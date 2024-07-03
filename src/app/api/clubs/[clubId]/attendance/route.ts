import { formatDate } from "@/lib/utils";
import { db } from "@/server/db";
import moment from "moment";
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
        const schedules = await db.schedule.findMany({
            where:{
                clubId:params.clubId
            }
        });


        const todayScheduleExists = schedules.find((item)=> formatDate(item.date.toISOString() as string) === formatDate(new Date().toISOString()));
        if(todayScheduleExists) {
           return  new NextResponse("Schedule already created",{
                status:403
            })
        }

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
