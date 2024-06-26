import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    try {
        const data =  await db.assignment.findMany({
            where:{
                clubId:params.clubId
            },
            include:{
                submissions:true
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