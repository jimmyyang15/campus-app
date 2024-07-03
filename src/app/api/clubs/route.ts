import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

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
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}

export async function POST(req: NextRequest) {
    try {
        const user = await validateRequest()
        const { name, desc, mentorId, clubImage, time, day } = await req.json()
        if (user?.role !== "ADMIN") {

            return NextResponse.json({
                status: 403,
                message: "You're not supposed to create clubs"

            })
        }




        await db.club.create({
            data: {
                name,
                timeActivity: time,
                dayActivity: day,
                desc: desc as string,
                clubImage: clubImage as string,
                members: {
                    connect: {
                        id: mentorId
                    }
                }
            }
        });



        return NextResponse.json({
            status: 201,
            message: "Club created"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}
