import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await db.club.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            request: {
                include: {
                    user: true
                }
            }
        }
    });

    return NextResponse.json({
        data,
    })
}