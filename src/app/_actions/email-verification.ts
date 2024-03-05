import { db } from "@/server/db";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
	// await db.table("email_verification_code").where("user_id", "=", userId).deleteAll();
    await db.emailVerification.deleteMany({
        where:{
            userId
        }
    })
    const code = Math.random().toString(36).substring(2, 8)
	// await db.table("email_verification_code").insert({
	// 	user_id: userId,
	// 	email,
	// 	code,
	// 	expires_at: createDate(new TimeSpan(5, "m")) // 5 minutes
	// });

    await db.emailVerification.create({
        data:{
            userId,
            expiresAt:createDate(new TimeSpan(5, "m")),
            code,
            email

        }
    })
	return code;
}