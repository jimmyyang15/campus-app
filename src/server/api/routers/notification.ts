import { z } from "zod";
import webPush from 'web-push'
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { env } from "@/env";
import { Subscription } from "@prisma/client";

export const notificationRouter = createTRPCRouter({
    sendNotificationToMentor: protectedProcedure.input(z.object({
        clubId: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { clubId } = input;
        const user = await ctx.session.user;
        const members = await ctx.db.club.findFirst({
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
        const mentor = members?.members.find((member) => member.isMentor);
        const notificationPayload = JSON.stringify({
            title: 'Class Absence Notification',
            body: `Student ${user.profile.fullName} cannot attend class. `,
            icon: '/icon512_rounded.png',
        });
        const subscription = mentor?.subscription[0];
        // const pushPromises = mentor?.subscription.map((subscription:Subscription) => {
        //     webPush.sendNotification(
        //         {
        //             endpoint: subscription.endpoint,
        //             keys: {
        //                 p256dh: subscription.p256dh,
        //                 auth: subscription.auth
        //             }
        //         },
        //         notificationPayload,{
        //             vapidDetails:{
        //                 subject:"mailto:huangandrian02@gmail.com",
        //                 publicKey:env.NEXT_PUBLIC_VAPID_KEY,
        //                 privateKey:env.WEB_PUSH_PRIVATE_KEY
        //             }
        //         }
        //     )
        // })
        // return await Promise.all(
        //     pushPromises as void[]
        // );
        return await webPush.sendNotification(
            {
                endpoint: subscription?.endpoint as string,
                keys: {
                    p256dh: subscription?.p256dh as string,
                    auth: subscription?.auth as string
                }
            },
            notificationPayload, {
            vapidDetails: {
                subject: "mailto:huangandrian02@gmail.com",
                publicKey: env.NEXT_PUBLIC_VAPID_KEY,
                privateKey: env.WEB_PUSH_PRIVATE_KEY
            }
        }
        )

    })

});
