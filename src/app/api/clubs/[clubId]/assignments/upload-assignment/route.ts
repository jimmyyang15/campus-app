import { db } from "@/server/db";
import { NextResponse } from "next/server";


type Payload = {
    name: string,
    desc?: string,
    dueDate: Date,
    file:string,
}
export async function POST(req:Request,{params}:{params:{clubId:string}}) {


    const payload:Payload = await req.json();
    await db.assignment.create({
        data: {
            ...payload,
            clubId:params.clubId
        }
    })

    return NextResponse.json({
        status:201,
        message:"Assignment Uploaded"
    })
}