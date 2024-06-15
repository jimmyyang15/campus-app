import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure:process.env.NODE_ENV !== "development",
    auth:{
        user:process.env.EMAIL_TEST,
        pass:process.env.EMAIL_TEST_PSWD
    },

} as SMTPTransport.Options);


export const sendVerificationEmail =async(email:string,code:string) => {
    const send = await transport.sendMail({
        from:process.env.EMAIL_TEST,
        to:email,
        subject: "Confirm your email",
        html: `
        <div> <p>Hi! Here's your code for email verification ${code}</p>
        <br />
        <p>Please copy and paste this code to your confirmation form </p></div>`,

    });
    console.log(send)
}