import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{assignmentId:string}}) {

    const data = await db.post.findMany({
        include:{
          user:{
            include:{
              profile:true
            }
          },
          reactions:{
            include:{
              user:true
            }
          }
        },
        orderBy:{
          createdAt:'desc'
        }
      });
     

    return NextResponse.json({
        data
    })
}