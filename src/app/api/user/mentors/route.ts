import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const data = await db.user.findMany({
            where:{
              AND:[{
                isMentor:true,

              },{
                club:null
              }]
                
            },
            include:{
                profile:true
            }

        })
  
  
      return NextResponse.json({
        data
      })
    } catch (error) {
      return new NextResponse("Internal server error", {
        status: 500
      })
    }
  
  }
  