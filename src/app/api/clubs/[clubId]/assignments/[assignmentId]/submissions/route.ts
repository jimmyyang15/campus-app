import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{assignmentId:string}}) {
    try {
        const data = await db.submission.findMany({
            where:{
                assignmentId:params.assignmentId
            },
            include:{
                assignment:true,
                user:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        return NextResponse.json({
            data
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        }) 
    }



}

export async function POST(req:NextRequest,{params}:{params:{assignmentId:string}}) {
    try {
        const { file } = await req.json()
        const user = await validateRequest()
        await db.submission.create({
            data:{
                assignmentId:params.assignmentId,
                files:file,
                userId:user?.id as string,
            }
        })
    
        return NextResponse.json({
            status:201,
            message:"Assignment submitted"
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        }) 
    }
   
}
