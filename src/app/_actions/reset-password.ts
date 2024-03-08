"use server"

import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/lib/schemas";
import { db } from "@/server/db";
import { generateId } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { findUserByEmail } from "./user";
import { sendResetPasswordToken, sendVerificationEmail } from "@/lib/mail";

async function createPasswordResetToken(userId: string): Promise<string> {
    // optionally invalidate all existing tokens
    await db.passwordResetToken.deleteMany({
        where: {
            userId
        }
    })
    const tokenId = generateId(40);
    await db.passwordResetToken.create({
        data: {
            id: tokenId,
            userId,
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
    if(!user || !user.emailVerified) {
        return {
            error:"User with this email not found!"
        }
    }

    const verificationToken = await createPasswordResetToken(user.id);
	const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${verificationToken}`;
    await sendResetPasswordToken(email, verificationLink);

    return {
        success:`Email sent! `
    }

}