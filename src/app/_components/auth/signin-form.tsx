import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackgroundGradient } from "@/app/_components/ui/background-gradient";
import BackgroundDot from "@/app/_components/ui/background-dot";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
const SigninForm = () => {
  // 1. Define your form.
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: LoginSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-1/3"
        className="max-w-xl rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <p className="text-center text-xl font-semibold">Welcome Back!</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@mail.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className="flex items-center gap-x-2 w-full">
              <Separator className="flex-[0.5]"  />
              <span>or</span>
              <Separator className="flex-[0.5]" />
            </div>
          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

export default SigninForm;
