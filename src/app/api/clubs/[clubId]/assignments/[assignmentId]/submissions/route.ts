import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{assignmentId:string}}) {

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
}