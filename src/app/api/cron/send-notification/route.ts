import { env } from "@/env";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { Subscription } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import webPush from 'web-push'

export async function GET(req: NextRequest) {
    const today = new Date().getDay();
    const sendNotification = async (subscription: Subscription, notification: string) => {
        try {
            await webPush.sendNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                },
                notification, {
                vapidDetails: {
                    subject: "mailto:huangandrian02@gmail.com",
                    publicKey: env.NEXT_PUBLIC_VAPID_KEY,
                    privateKey: env.WEB_PUSH_PRIVATE_KEY
                }
            }
            )
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };
    try {
        const activities = await db.club.findMany({
            where: {
                dayActivity: today.toString()
            },
            include: {
                members: true
            },
        });

        for (const activity of activities) {
            const notification = JSON.stringify({
                title: 'Today\'s Activity',
                body: `Your club's activity "${activity.name}" is happening today.`,
                icon: '/icon512_rounded.png',
                data: {
                    url: `/club/${activity.id}`, // Adjust URL as necessary
                },
            });
            for (const participant of activity.members) {
                const subscriptions = await db.subscription.findMany({
                    where: { userId: participant.id },
                });

                for (const subscription of subscriptions) {
                    await sendNotification(subscription, notification);
                }
            }
        }
    } catch (error) {
        return new NextResponse("Internal server error", {
            status: 500
        })
    }

}

