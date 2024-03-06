"use server";

import { db } from "@/server/db";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import jwt from "jsonwebtoken"
import { lucia } from "@/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmailVerificationSchemaType } from "@/lib/schemas";

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
    // await db.table("email_verification_code").where("user_id", "=", userId).deleteAll();
    await db.emailVerification.deleteMany({
        where: {
            userId
        }
    })
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    // await db.table("email_verification_code").insert({
    // 	user_id: userId,
    // 	email,
    // 	code,
    // 	expires_at: createDate(new TimeSpan(5, "m")) // 5 minutes
    // });

    await db.emailVerification.create({
        data: {
            userId,
            expiresAt: createDate(new TimeSpan(5, "m")),
            code,
            email

        }
    })
    return code;
}

export async function generateRedirectUrl(props: {
    userId: string;
    email: string;
    username: string;
}) {
    const { userId, email, username } = props;
    const temporaryCode = Math.random().toString(36).substring(2, 8);
    await db.emailVerification.update({
        where: {
            userId,
        },
        data: {
            temporaryToken: temporaryCode
        }
    });
    const token = jwt.sign(
        { email, temporaryCode, userId },
        process.env.JWT_SECRET!,
        {
            expiresIn: "5m",
        }
    );

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`;

    return redirectUrl
}


export const emailVerification = async (decodedValue: {
    temporaryCode: string;
    email: string;
    userId: string;
}) => {
    const { email, temporaryCode, userId } = decodedValue
    const emailVerification = await db.emailVerification.findFirst({
        where: {
            AND: [
                {
                    email
                }, {
                    temporaryToken: temporaryCode
                }, {
                    userId
                }
            ]
        }
    });

    return emailVerification

}

export const verifyEmail = async (decodedValue:{
    email:string,
    userId:string,

},values:EmailVerificationSchemaType) => {
    const { email,userId } = decodedValue;
    const { code} = values;
    const verifyCode = await db.emailVerification.findFirst({
        where:{
            code,
            email,
            userId
        }
    });

    if(!verifyCode) {
        return {
            error:"Incorrect code"
        }
    }

    await db.emailVerification.deleteMany({
        where: {
            userId
        }
    });

    await lucia.invalidateUserSessions(userId);


    await db.user.update({
        where: {
            email
        }, data: {
            emailVerified: true
        }
    });


    const session = await lucia.createSession(userId, {
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/");
}