import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Payload = {
    postId: string;
    type: string;

}
export async function POST(req: Request) {


    const user = await validateRequest();
    const { postId, type }: Payload = await req.json();
    const existingReaction = await db.reaction.findFirst({
        where: {
            AND: [
                {
                    userId: user?.id
                }, {
                    postId
                }
            ]

        }
    });

    if (existingReaction?.type === type) {
        await db.reaction.delete({
            where: {
                id: existingReaction.id
            }
        })
        return NextResponse.json({
            status: 201,
            message: "Reaction deleted"
        })
    }

    if (existingReaction) {
        await db.reaction.update({
            where: {
                id: existingReaction.id
            }, data: {
                type
            }
        })
        return NextResponse.json({
            status: 201,
            message: "Reaction updated"
        })

    }


    await db.reaction.create({
        data: {
            postId,
            type,
            userId: user?.id

        }
    })
    return NextResponse.json({
        status: 201,
        message: "Reaction given"
    })
}