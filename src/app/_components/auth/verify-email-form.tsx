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
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormAlert from "@/app/_components/auth/alert";
import { AlertType } from "@/app/_components/auth/signup-form";
import { signin } from "@/app/_actions/signin";
import { Loader2 } from "lucide-react";
const VerifyEmailForm = () => {
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<EmailVerificationSchemaType>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });
  const [error, setError] = useState<AlertType | null>(null);
  // 2. Define a submit handler.
  function onSubmit(values: EmailVerificationSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setError(null);
    startTransition(async () => {});
  }
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-1/3"
        className="max-w-xl rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="johndoe12" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormAlert alert={error} />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </Button>
          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

export default VerifyEmailForm;
