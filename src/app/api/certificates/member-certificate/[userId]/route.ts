import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{ params }: { params: { userId: string } }) {

    const data = await db.certificate.findUnique({
        where:{
            userId:params.userId
        }
    })

    return NextResponse.json({
        data
    })
}