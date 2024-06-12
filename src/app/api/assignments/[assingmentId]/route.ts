import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    const data =  await db.assignment.findMany({
        where:{
            clubId:params.clubId
        }
    })

    return NextResponse.json({
        data,
    })
}