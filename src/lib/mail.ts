import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);


export const sendVerificationEmail = async (email: string,code:string) => {
    // const confirmLink = `http://localhost:3000/auth/verify-email`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `
        <div> <p>Hi! Here's your code for email verification ${code}</p>
        <br />
        <p>Please copy and paste this code to your confirmation form </p></div>
       `
    })
};