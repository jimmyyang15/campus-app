"use server"

import { generateId } from "lucia";
import { Argon2id } from 'oslo/password'
import { db } from "@/server/db";
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas";
import { lucia } from "@/server/auth";
import { cookies } from "next/headers";
import { findUserByEmail, findUserByUsername } from "./user";
import { generateEmailVerificationCode, generateRedirectUrl } from "./email-verification";
import { sendVerificationEmail } from "@/lib/mail";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken"
export const signUp = async (values: RegisterSchemaType) => {


    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }


    const { username, city, fullName, email } = validatedFields.data;

    const hashedPassword = await new Argon2id().hash(values.password);
    const userId = generateId(15);

    const userExistsByUsername = await findUserByUsername(username)
    const userExistsByEmail = await findUserByEmail(email);

    if (userExistsByEmail) {
        return {
            error: "Email has been used!"
        }
    }
    if (userExistsByUsername) {
        return {
            error: "Username is not available!"
        }
    }

    await db.user.create({
        data: {
            id: userId,
            username,
            hashedPassword,
            email,
            profile: {
                create: {
                    city,
                    fullName
                }
            }
            // googleId:"fsdfs"
        }
    });
    const verificationCode = await generateEmailVerificationCode(userId, email);
    await sendVerificationEmail(email, verificationCode);
    const redirectUrl = await generateRedirectUrl({
        email,
        userId,
        username
    })

    // const session = await lucia.createSession(userId, {
    //     expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
    // })

    // const sessionCookie = lucia.createSessionCookie(session.id);
    // cookies().set(
    //     sessionCookie.name,
    //     sessionCookie.value,
    //     sessionCookie.attributes
    // );

    return redirect(redirectUrl)

}