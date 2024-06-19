import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { getDownloadFileName } from './utils';
import { env } from '@/env';

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure:env.NODE_ENV !== "development",
    auth:{
        user:env.EMAIL_TEST,
        pass:env.EMAIL_TEST_PSWD
    },

} as SMTPTransport.Options);


export const sendVerificationEmail =async(email:string,code:string) => {
    await transport.sendMail({
        from:process.env.EMAIL_TEST,
        to:email,
        subject: "Confirm your email",
        html: `
        <div> <p>Hi! Here's your code for email verification ${code}</p>
        <br />
        <p>Please copy and paste this code to your confirmation form </p></div>`,

    });
}

export const sendResetPasswordToken = async(email:string,verificationLink:string) => {
    await transport.sendMail({
        from:env.EMAIL_TEST,
        to:email,
        subject: "Reset password",
        html: `
        <p>Click <a href=${verificationLink}>here</a> to reset password</p>
      
       `
    });
}
export const sendEmailCertificate = async(email:string,file:string) => {
    await transport.sendMail({
        from:env.EMAIL_TEST,
        to:email,
        subject: "Certificate of completion",
        html: `
        <p>Congratulations on completing the club's activity. Here's your certificate</p>,
      
       `,
       attachments:[{
        filename:getDownloadFileName(file),
        path:file,
        contentType: 'application/pdf'
       }]
    });
}