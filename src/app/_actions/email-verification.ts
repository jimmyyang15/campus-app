import { db } from "@/server/db";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import jwt from "jsonwebtoken"

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

export async function generateRedirectUrl(props:{
    userId:string;
    email:string;

}) {
    const { userId,email } = props;
    const temporaryCode = Math.random().toString(36).substring(2, 8);
    await db.emailVerification.update({
        where:{
            userId,
        },
        data:{
            temporaryToken:temporaryCode
        }
    });
    const token = jwt.sign(
        { email,  temporaryCode },
        process.env.JWT_SECRET!,
        {
            expiresIn: "5m",
        }
    );

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`;

    return redirectUrl
}


export const emailVerification = async(decodedValue:{
    code:string;
    email:string;
    userId:string
}) => {
    const { email,code,userId } = decodedValue
    const emailVerification = await db.emailVerification.findFirst({
        where:{
            AND:[
                {
                    email
                },{
                    temporaryToken:code
                },{
                    userId
                }
            ]
        }
    });

    return emailVerification

}

export const verifyEmail = async() => {
    
}