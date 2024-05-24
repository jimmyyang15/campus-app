"use client";

import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/lib/schemas/auth";
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
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useRouter } from "next/navigation";
import FormAlert from "./alert";
import { AlertType } from "./signup-form";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/app/_actions/reset-password";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const [success, setSuccess] = useState<AlertType | null>(null);
  const [error, setError] = useState<AlertType | null>(null);
  // 2. Define a submit handler.
  function onSubmit(values: ResetPasswordSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await forgotPassword(values);
      if (res.error) {
        setError({
          message: res.error,
          status: "error",
          desc: "Make sure the email has been registered to this app",
        });
      }

      if (res.success) {
        setSuccess({
          message: res.success,
          status: "success",
          desc: `Please check it on ${values.email}`,
        });
      }
    });

    console.log(values);
  }
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-[85%] sm:w-3/4 md:w-1/2 lg:w-1/3"
        className=" w-full rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <p className="mb-8 text-center text-base font-semibold md:text-lg lg:text-xl">Reset Password</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm ">Email</FormLabel>
                  <FormControl>
                    <Input className="text-xs sm:text-sm  h-8 md:h-10" placeholder="johndoe@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormAlert alert={success || error} />

            <Button type="submit" className="p-0 text-xs sm:text-sm w-full h-8 md:h-10" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send email
            </Button>
          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

export default ForgetPasswordForm;
