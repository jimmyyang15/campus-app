
import VerifyEmailForm from "@/app/_components/auth/verify-email-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import jwt from 'jsonwebtoken'
import { db } from "@/server/db";
import { emailVerification } from "@/app/_actions/email-verification";
export const metadata: Metadata = {
  title: "Verify your email",
  description: "Email verification page",
};
const VerifyPage = async({
  searchParams,
}: {
  searchParams: { token:string };
}) => {

  const { token } = searchParams;
  if(!token) {
    return notFound()
  }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string
      code: string
      userId: string
    }
 

  const emailVerificationQuery = await emailVerification(decoded);
  const hasExpired = emailVerificationQuery!.expiresAt > new Date(new Date().getTime() + 5 * 60000);
  console.log(hasExpired)
  if(!emailVerificationQuery) {
    return notFound();
  }
  return (
    <div>
      <VerifyEmailForm email={decoded.email} />
    </div>
  );
};

export default VerifyPage;
