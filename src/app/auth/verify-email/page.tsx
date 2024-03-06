import VerifyEmailForm from "@/app/_components/auth/verify-email-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import { db } from "@/server/db";
import { emailVerification } from "@/app/_actions/email-verification";
export const metadata: Metadata = {
  title: "Verify your email",
  description: "Email verification page",
};
const VerifyPage = async ({
  searchParams,
}: {
  searchParams: { token: string };
}) => {
  let decoded:{
    email: string;
    userId: string;
    temporaryCode: string;
    exp: number;
  };
  const { token } = searchParams;
  if (!token) {
    return notFound();
  }

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      userId: string;
      temporaryCode: string;
      exp: number;
    };

    console.log(decoded);

    const emailVerificationQuery = await emailVerification(decoded);
    const hasExpired =
      emailVerificationQuery!.expiresAt >
      new Date(new Date().getTime() + 5 * 60000);
    console.log(hasExpired);
    if (!emailVerificationQuery) {
      return notFound();
    }
  } catch (error) {
    return notFound();
  }

  return (
    <div>
      <VerifyEmailForm email={decoded.email} userId={decoded.userId} />
    </div>
  );
};

export default VerifyPage;
