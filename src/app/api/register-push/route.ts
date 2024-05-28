import { validateRequest } from "@/server/auth"
import { db } from "@/server/db"
import { NextResponse } from "next/server"
import { PushSubscription } from "web-push"
export async function POST(req: Request) {
    try {
        const newSubscription: PushSubscription | undefined = await req.json()
        if (!newSubscription) {
            return NextResponse.json({
                error: "Missing push subscription in body",

            }, {
                status: 400
            })
        }
        console.log("received push subscription")
        const { user } = await validateRequest();
        if (!user) {
            return NextResponse.json({
                error: "User not authenticated"
            }, {
                status: 401
            })
        }
        await db.subscription.create({
            data: {
                endpoint: newSubscription.endpoint,
                p256dh: newSubscription.keys.p256dh,
                auth: newSubscription.keys.auth,
                userId: user.id
            }
        });

        return NextResponse.json({
            message: "Push Subscription saved"
        }, {
            status: 200
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: "Internal Server error",

        }, {
            status: 500
        })
    }
}

export async function DELETE(req: Request) {
    try {
        const subscriptionToDelete: PushSubscription | undefined = await req.json();
        if (!subscriptionToDelete) {
            return NextResponse.json({
                error: "Missing push subscription in body"
            }, {
                status: 400
            })
        }
        console.log('received push subs: ', subscriptionToDelete);
        const { user } = await validateRequest();
        if (!user) {
            return NextResponse.json({
                error: "User not authenticated",

            }, {
                status: 401
            })
        }

        await db.subscription.delete({
            where: {
                endpoint: subscriptionToDelete.endpoint
            }
        });

        return NextResponse.json({
            message: "Push subscription deleted"
        }, {
            status: 200
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            error: "Internal Server error",

        }, {
            status: 500
        })
    }
}