import { env } from "@/env";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { Subscription } from "@prisma/client";
import { NextResponse } from "next/server";
import webPush from 'web-push'
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { clubId } = body;
        // const user = await validateRequest()
        const members = await db.club.findFirst({
            where: {
                id: clubId
            },
            select: {
                members: {
                    include: {
                        subscription: true
                    },
                    where:{
                        isMentor:false
                    }
                }
            }
        });
        const notificationPayload = JSON.stringify({
            title: 'Club Notification',
            body: `There won't be club activity today!`,
            icon: '/icon512_rounded.png',
            clubId
        });

        

        const pushPromises = members?.members.map((member)=>{
            return member?.subscription.map((subscription:Subscription) => {
                webPush.sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.p256dh,
                            auth: subscription.auth
                        }
                    },
                    notificationPayload,{
                        vapidDetails:{
                            subject:"mailto:huangandrian02@gmail.com",
                            publicKey:env.NEXT_PUBLIC_VAPID_KEY,
                            privateKey:env.WEB_PUSH_PRIVATE_KEY
                        }
                    }
                )
            });
        }).flat()
        // console.log(pushPromises)
        // await Promise.all(
        //     pushPromises as void[]
        // );
        // webPush.setVapidDetails(`mailto:${env.WEB_PUSH_EMAIL}`, env.NEXT_PUBLIC_VAPID_KEY, env.WEB_PUSH_PRIVATE_KEY);
        // const response = await webPush.sendNotification(
        //     {
        //         endpoint: subscription?.endpoint as string,
        //         keys: {
        //             p256dh: subscription?.p256dh as string,
        //             auth: subscription?.auth as string
        //         }
        //     },
        //     notificationPayload
        // );
        await Promise.all(pushPromises as void[]);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        if (err instanceof webPush.WebPushError) {
            return new NextResponse(err.body, {
                status: err.statusCode,
                headers: err.headers,
            });
        }
        console.log(err);
        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}
