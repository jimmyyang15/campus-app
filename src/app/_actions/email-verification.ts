"use server";

import { db } from "@/server/db";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import jwt from "jsonwebtoken"
import { lucia } from "@/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmailVerificationSchemaType } from "@/lib/schemas";
import { sendVerificationEmail } from "@/lib/mail";

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
    // await db.table("email_verification_code").where("user_id", "=", userId).deleteAll();

    //delete email verification, otherwise it'll cause foreign key issue
    await db.emailVerification.deleteMany({
        where: {
            userId
        }
    })

    //6 digit code in string for verification
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // await db.table("email_verification_code").insert({
    // 	user_id: userId,
    // 	email,
    // 	code,
    // 	expires_at: createDate(new TimeSpan(5, "m")) // 5 minutes
    // });

    //create email verification 
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
            expiresIn: "1h",
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

export const verifyEmail = async (decodedValue: {
    email: string,
    userId: string,

}, otp:string) => {
    const { email, userId } = decodedValue;

    const verifyCode = await db.emailVerification.findFirst({
        where: {
          AND:[
            {
                email
            },{
                userId
            },{
                code:otp
            }
          ]
        }
    });

    console.log("fdddd", !!verifyCode)

    if (!verifyCode) {
        return {
            error: "Incorrect code"
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

export const resendVerificationEmail = async (userId: string, email: string) => {

    //find existing email verification
    const existingVerification = await db.emailVerification.findFirst({
        where:{
            AND:[
                {
                    email
                },{
                    userId
                }
            ]
        }
    })

    //resend limit
    const curDate = new Date()
    const dateLimit = new Date(existingVerification!.expiresAt.getTime()  - (2 * 60000 + 30 * 1000))

    if(curDate < dateLimit) {
        return {
            error:"Please wait for a while!"
        }
    }

    //6 digit code in string for verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await db.emailVerification.update({
        where: {
            userId,
            email,
        }, data: {
            code,
            expiresAt: createDate(new TimeSpan(5, "m")),

        }
    });
    await sendVerificationEmail(email, code);
    return {
        success:"Email resent successfully!"
    }
}