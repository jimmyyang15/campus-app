import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type ProfileDto = {
    fullName?:string;
    city?:string;
    dob?:string;
    profilePicture?:string;
}
export async function PUT(req: Request) {
    try {
        const dto: ProfileDto = await req.json();
        const user = await validateRequest()
        if(!user) {
            return NextResponse.json({
                error:"Unauthorized"
            },{
                status:401
            })
        }
        await db.profile.update({
            where:{
                userId:user?.id
            },data:dto
        })
      
        return NextResponse.json({
          status: 201,
          message: "Profile Updated"
        })
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }

   
  }