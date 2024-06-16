import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    comment: string;

}
export async function POST(req: Request, { params }: { params: { postId: string } }) {
    try {

        const { comment }: Payload = await req.json();
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        }
        await db.comment.create({
            data: {
                text: comment,
                userId: user?.id,
                postId: params.postId
            }
        })

        return NextResponse.json({
            status: 201,
            message: "Comment created"
        })
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}