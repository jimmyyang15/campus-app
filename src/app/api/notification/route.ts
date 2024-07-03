import { env } from "@/env";
import { formatDate } from "@/lib/utils";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { Subscription } from "@prisma/client";
import { NextResponse } from "next/server";
import webPush from 'web-push'
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { clubId,reason } = body;
        const user = await validateRequest()
        const members = await db.club.findFirst({
            where: {
                id: clubId
            },
            select: {
                members: {
                    include: {
                        subscription: true
                    }
                }
            }
        });
        const schedules = await db.schedule.findMany({
            where:{
                clubId
            }
        });

        const todaySchedule = schedules.find((item)=>formatDate(item.date.toISOString()) === formatDate(new Date().toISOString()))
        await db.absence.create({
            data:{
                userId:user?.id as string,
                reason,
                scheduleId:todaySchedule?.id as string
            }
        })

        const mentor = members?.members.find((member) => member.isMentor);
        const notificationPayload = JSON.stringify({
            title: 'Class Absence Notification',
            body: `Student ${user!.profile.fullName} cannot attend class. Reason: ${reason} `,
            icon: '/icon512_rounded.png',
            clubId
        });
        const pushPromises = mentor?.subscription.map((subscription:Subscription) => {
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
