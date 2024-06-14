import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{postId:string}}) {

    const data = await db.post.findUnique({
        where:{
          id:params.postId
        },
        include:{
          user:{
            include:{
              profile:true
            }
          },
          reactions:true,
          comments:{
            orderBy:{
              createdAt:"desc"
            },
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