import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    comment:string;

}
export async function POST(req:Request,{params}:{params:{postId:string}}) {


    const { comment }:Payload = await req.json();
    const user = await validateRequest()
    await db.comment.create({
        data:{
            text:comment,
            userId:user?.id,
            postId:params.postId
        }
    })

    return NextResponse.json({
        status:201,
        message:"Comment created"
    })
}