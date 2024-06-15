import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{assignmentId:string}}) {

    const data = await db.assignment.findUnique({
        where:{
            id:params.assignmentId
        },include:{
            submissions:{
                include:{
                    user:{
                        include:{
                            profile:true
                        }
                    }
                }
            }
        }
    })

    return NextResponse.json({
        data
    })
}
export async function DELETE(req:NextRequest,{params}:{params:{assignmentId:string}}) {
    const user = await validateRequest();
    if(!user?.isMentor) {
        return NextResponse.json({
            status:403,
            message:"You're not allowed to use this resource"
        })
    }
     await db.assignment.delete({
        where:{
            id:params.assignmentId
        }
    })

    return NextResponse.json({
        status:201,
        message:"Assignment deleted"
    })
}