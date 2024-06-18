import { sendEmailCertificate } from "@/lib/nodemailer";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
type Payload = {
    file:string;
    recipientId:string;
    email:string;
}
export async function POST(req:Request) {
    const { file, recipientId,email}:Payload = await req.json();

    await db.certificate.create({
        data: {
            userId: recipientId,
            file
        }
    });

    await sendEmailCertificate(email,file)

    return NextResponse.json({
        status:201,
        message:"Certificate sent"
    })
}