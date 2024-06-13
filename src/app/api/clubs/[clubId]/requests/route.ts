import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    const data =  await db.request.findMany({
        where: {
            clubId: params.clubId
        },
        include: {
            user: {
                include: {
                    profile: true
                }
            }
        }
    })

    return NextResponse.json({
        data,
    })
}