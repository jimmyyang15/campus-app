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