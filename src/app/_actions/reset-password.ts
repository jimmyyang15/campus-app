"use server"

import { NewPasswordSchema, NewPasswordSchemaType, ResetPasswordSchema, ResetPasswordSchemaType } from "@/lib/schemas/auth";
import { db } from "@/server/db";
import { generateId } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { findUserByEmail } from "./user";
import { sendResetPasswordToken, sendVerificationEmail } from "@/lib/mail";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { lucia } from "@/server/auth";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
async function createPasswordResetToken(userId: string): Promise<string> {
    // optionally invalidate all existing tokens
    await db.passwordResetToken.deleteMany({
        where: {
            userId
        }
    })
    const tokenId = generateId(40);
    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
    await db.passwordResetToken.create({
        data: {
            id: tokenId,
            userId,
            tokenHash,

            expiresAt: createDate(new TimeSpan(5, 'm'))
        }
    });
    return tokenId;
}

export const forgotPassword = async (values: ResetPasswordSchemaType) => {
    const validatedFields = ResetPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }
    const { email } = validatedFields.data;

    const user = await findUserByEmail(email);
    if (!user || !user.emailVerified) {
        return {
            error: "User with this email not found!"
        }
    }

    const verificationToken = await createPasswordResetToken(user.id);
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${verificationToken}`;
    await sendResetPasswordToken(email, verificationLink);

    return {
        success: `Email sent! `
    }

}

export const resetPassword = async (values: NewPasswordSchemaType, tokenHash: string) => {
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }

    const { password } = validatedFields.data;
    const tokenExists = await findPasswordToken(tokenHash);
    await lucia.invalidateUserSessions(tokenExists?.userId as string);
    const hashedPassword = await new Argon2id().hash(password);
    await db.user.update({
        where: {
            id: tokenExists?.userId
        },
        data: {
            hashedPassword
        }
    });
    await db.passwordResetToken.deleteMany({
        where: {
            tokenHash
        }
    })
    const session = await lucia.createSession(tokenExists?.userId as string, {
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/auth/signin")


}

export const findPasswordToken = async (tokenHash: string) => {
    const token = await db.passwordResetToken.findFirst({
        where: {
            tokenHash
        }
    });



    return token;
}