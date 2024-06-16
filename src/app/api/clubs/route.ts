import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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
    } catch (error) {
        return new NextResponse("Internal server error",{
            status:500
        })
    }

}