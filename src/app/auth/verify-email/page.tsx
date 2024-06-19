import VerifyEmailForm from "@/app/_components/auth/verify-email-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
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
  let decoded: {
    email: string;
    userId: string;
    temporaryCode: string;
    exp: number;
  };
  let expiresAt:number | undefined;
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

    const emailVerificationQuery = await emailVerification(decoded);
    expiresAt = emailVerificationQuery?.expiresAt.getTime();
    const hasExpired =
      emailVerificationQuery!.expiresAt.getTime() >
      new Date(new Date().getTime() + 5 * 60000).getTime();
    if (hasExpired) {
      return notFound();
    }
    if (!emailVerificationQuery) {
      return notFound();
    }
  } catch (error) {
    return notFound();
  }

  return (
    <div>
      <VerifyEmailForm email={decoded.email} userId={decoded.userId} expiresAt={expiresAt as number} />
    </div>
  );
};

export default VerifyPage;
