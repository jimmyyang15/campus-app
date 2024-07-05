import { db } from "@/server/db"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req:NextRequest,{params}:{params:{assignmentId:string}}) {
    try {
        
        const { mark,submissionId } = await req.json()


    await db.submission.update({
        where:{
           id:submissionId
        },
        data:{
            mark:mark
        }
    })

    return NextResponse.json({
        status:201,
        message:"Submission Marked"
    })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        }) 
    }
    
}