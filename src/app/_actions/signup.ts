"use server"
// import * as argon2 from "argon2"
import { generateId } from "lucia";
import { db } from "@/server/db";
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas/auth";
import { findUserByEmail, findUserByUsername } from "./user";
import { generateEmailVerificationCode, generateRedirectUrl } from "./email-verification";
import { redirect } from "next/navigation";
import { adminUsername, mentorNid, userNim } from "@/user-nim";
import { hash } from "bcrypt";
import { sendVerificationEmail } from "@/lib/nodemailer";
export const signUp = async (values: RegisterSchemaType) => {


    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }


    const { username, city, fullName, email } = validatedFields.data;

    const hashedPassword = await hash(values.password,12);
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


    if (userNim.includes(username) || mentorNid.includes(username) || adminUsername.includes(username)) {
        await db.user.create({
            data: {
                id: userId,
                username,
                hashedPassword,
                email,
                isMentor: userNim.includes(username) ? false : mentorNid.includes(username) ? true : false,
                role:adminUsername.includes(username) ? "ADMIN" : "USER",
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
    }  else {
     
        return {
            error: "Username is not registered"
        }
    }



}