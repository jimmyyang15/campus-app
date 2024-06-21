import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
        const user = await validateRequest()
        const data = await db.user.findUnique({
            where:{
                id:user?.id
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
  