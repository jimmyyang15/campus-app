"use client";
import React, { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { BackgroundGradient } from "@/app/_components/ui/background-gradient";
import BackgroundDot from "@/app/_components/ui/background-dot";
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas";
import Link from "next/link";
import { signUp } from "@/app/_actions/signup";
import FormAlert from "./alert";

export interface AlertType {
  status:'error' | 'success';
  message:string;
  desc:string
}
const SignupForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error,setError] = useState<AlertType | null>(null);
  const [success,setSuccess] = useState<AlertType | null>(null);
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      city: "",
      username: "",
      confirmPassword: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: RegisterSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setError(null);
    setSuccess(null)
    startTransition(async () => {
      const res = await signUp(values);
      if (res?.success) {
        setSuccess({
          status:"success",
          message:"Successfully signed up!",
          desc:"Email verification has been sent to " + res.data.email
        })
      } else  {
        setError({
          status:"error",
          message:res?.error as string,
          desc:"Try another one!"
        })
      }
     
    });
  }
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-1/3 my-4"
        className="max-w-xl  rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <p className="mb-8 text-center text-xl font-semibold">
          Create an account!
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} required />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe12" {...field} required />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@mail.com" {...field} required />
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
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      required
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      required
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Medan" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormAlert alert={success || error}  />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              
              Sign up
            </Button>
            <div className="flex w-full items-center gap-x-2">
              <Separator className="flex-[0.5]" />
              <span>or</span>
              <Separator className="flex-[0.5]" />
            </div>
            <Button type="button" variant={"outline"} className="w-full">
              Continue with Google
            </Button>

            <p className="text-sm">
              Already have an account?{" "}
              <Link href={"/auth/signin"} className="font-bold underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

export default SignupForm;
