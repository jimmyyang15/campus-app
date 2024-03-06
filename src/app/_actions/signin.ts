"use server";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import { generateEmailVerificationCode, generateRedirectUrl } from "./email-verification";
import { sendVerificationEmail } from "@/lib/mail";
import { findUserByUsername } from "./auth";
export async function signin(values: LoginSchemaType) {

    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }

    const { username, password } = validatedFields.data



    const existingUser = await findUserByUsername(username)
    if (!existingUser) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is none-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If usernames are public, you may outright tell the user that the username is invalid.
        return {
            error: "Incorrect username or password"
        };
    }



    const validPassword = await new Argon2id().verify(existingUser.hashedPassword as string, password);
    if (!validPassword) {
        return {
            error: "Incorrect username or password"
        };
    }

    if (!existingUser.emailVerified) {
        const userByUsername = await findUserByUsername(username)
        const verificationCode = await generateEmailVerificationCode(userByUsername?.email as string, userByUsername?.email as string);
        await sendVerificationEmail(userByUsername?.email as string, verificationCode);
        const redirectUrl = await generateRedirectUrl({
            email: userByUsername?.email as string,
            userId: userByUsername?.id as string,
            username
        })
        return redirect(redirectUrl)

    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}