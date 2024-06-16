import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest,{params}:{params:{submissionId:string}}) {
    try {
        await db.submission.delete({
            where:{
                id:params.submissionId
            }
        })
    
        return NextResponse.json({
            status:201,
            message:"Submission Removed"
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        }) 
    }

}
export async function PUT(req:NextRequest,{params}:{params:{submissionId:string}}) {
    try {
        const { file } = await req.json()


    await db.submission.update({
        where:{
           id:params.submissionId
        },
        data:{
            files:file,
        }
    })

    return NextResponse.json({
        status:201,
        message:"Submission Edited"
    })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        }) 
    }
    
}