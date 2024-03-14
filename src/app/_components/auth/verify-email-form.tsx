"use client";

import {
  EmailVerificationSchema,
  EmailVerificationSchemaType,
  LoginSchema,
  LoginSchemaType,
} from "@/lib/schemas";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackgroundGradient } from "@/app/_components/ui/background-gradient";
import BackgroundDot from "@/app/_components/ui/background-dot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";

import FormAlert from "@/app/_components/auth/alert";
import { AlertType } from "@/app/_components/auth/signup-form";

import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/utils";
import { resendVerificationEmail, verifyEmail } from "@/app/_actions/email-verification";
import { Button } from "@/app/_components/ui/button";
const VerifyEmailForm = ({ email, userId }:   {
  email: string;
  userId: string;
}) => {

  const [isPending, startTransition] = useTransition();
  const [isResendingEmail,startResendTransition] = useTransition()
  const [otp, setOtp] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<EmailVerificationSchemaType>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });
  const [error, setError] = useState<AlertType | null>(null);
  const [successResend,setSuccessResend] = useState<AlertType | null>(null)
  const [errorResend,setErrorResend] = useState<AlertType | null>(null)
  // 2. Define a submit handler.
  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setError(null);
    startTransition(async () => {
      const res = await verifyEmail(
        {
          email,
          userId,
        },
        otp as string,
      );
      if (res?.error) {
        // setSuccess({
        //   status:"success",
        //   message:"Successfully signed up!",
        //   desc:"Email verification has been sent to " + res.data.email
        // })
        setError({
          status: "error",
          message: res?.error as string,
          desc: "Please make sure it's the correct validation code",
        });
      }
    });
  }
  // let futureDate = new Date(new Date().getTime() + 5 * 60000);
  const resendEmailVerification =async() => {
    setSuccessResend(null);
    startResendTransition(async()=>{
      const res = await resendVerificationEmail(userId,email);
      if(res.success) {
        setSuccessResend({
          status:'success',
          message:res.success,
          desc:"Please check your email for confirmation"
        })
      }
      if(res.error) {
        setErrorResend({
          status:"error",
          message:res.error,
          desc:"Please try again later"
        })
      }
    })
  } 
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-1/3"
        className="max-w-xl rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <h1 className="text-center text-xl font-bold ">Verify your email</h1>
        <Form {...form}>
          <p className="my-4 text-sm">
            We just sent your email verification code via email to {email}
          </p>
          <form className="space-y-4">
            <FormLabel>Email Verification code</FormLabel>
            {/* <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input   {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <OTPInput
              onComplete={onSubmit}
              onChange={setOtp}
              value={otp ?? ""}
              maxLength={6}
              containerClassName="group flex w-full items-center justify-center has-[:disabled]:opacity-30"
              render={({ slots }) => (
                <>
                  <div className="flex">
                    {slots.slice(0, 3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex">
                    {slots.slice(3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                </>
              )}
            />

            <FormAlert alert={error} />

            {/* <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </Button> */}
            {isPending ? (
              <p className="flex justify-end text-sm">Verifying...</p>
            ) : null}
            <Button variant={'link'} type="button" onClick={resendEmailVerification}>Resend verification email</Button>
            <FormAlert alert={successResend || errorResend} />

          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative h-8 w-8 text-[1.25rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-y border-r border-border first:rounded-l-[4px] first:border-l last:rounded-r-[4px]",
        "group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20",
        "outline outline-0 outline-accent-foreground/20",
        { "outline-2 outline-primary": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// You can emulate a fake textbox caret!
function FakeCaret() {
  return (
    <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-4 w-px bg-white" />
    </div>
  );
}

// Inspired by Stripe's MFA input.
function FakeDash() {
  return (
    <div className="flex w-10 items-center justify-center">
      <div className="h-1 w-2 rounded-full bg-border" />
    </div>
  );
}

export default VerifyEmailForm;
