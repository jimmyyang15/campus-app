
import VerifyEmailForm from "@/app/_components/auth/verify-email-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Email verification page",
};
const VerifyPage = ({
  searchParams,
}: {
  searchParams: { token:string };
}) => {

  const { token } = searchParams;
  if(!token) {
    return notFound()
  }

  return (
    <div>
      <VerifyEmailForm />
    </div>
  );
};

export default VerifyPage;
