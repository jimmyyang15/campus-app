import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await validateRequest();

    const data = await db.certificate.findUnique({
        where:{
            userId:user?.id
        }
    })

    return NextResponse.json({
        data
    })
}