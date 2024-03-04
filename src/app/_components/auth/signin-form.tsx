"use client";

import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
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
import FormAlert from "./alert";
import { AlertType } from "./signup-form";
import { signin } from "@/app/_actions/signin";
import { Loader2 } from "lucide-react";
const SigninForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [error, setError] = useState<AlertType | null>(null);
  // 2. Define a submit handler.
  function onSubmit(values: LoginSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setError(null);
    startTransition(async () => {
      const res = await signin(values);
      if (res.error) {
        setError({
          message: res.error,
          status: "error",
          desc: "Make sure you type in the correct credentials",
        });
      }
    });
  }
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-1/3"
        className="max-w-xl rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <p className="mb-8 text-center text-xl font-semibold">Welcome Back!</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe12" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
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
              Sign in
            </Button>
            <div className="flex w-full items-center gap-x-2">
              <Separator className="flex-[0.5]" />
              <span>or</span>
              <Separator className="flex-[0.5]" />
            </div>
            <Button
              onClick={() => {
                router.push("/auth/signin/google");
              }}
              type="button"
              variant={"outline"}
              className="w-full"
            >
              Sign in with Google
            </Button>

            <p className="text-sm">
              Don't have an account yet?{" "}
              <Link href={"/auth/signup"} className="font-bold underline">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

export default SigninForm;
