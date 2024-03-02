"use server"

import { generateId } from "lucia";
import { Argon2id } from 'oslo/password'
import { db } from "@/server/db";
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas";
import { lucia } from "@/server/auth";
import { cookies } from "next/headers";

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


    try {
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
        const session = await lucia.createSession(userId, {
            expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
        })

        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return {
            success: true,
            data: {
                userId
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            return {
                error: err.message
            }
        }
    }
}