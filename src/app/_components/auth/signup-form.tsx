"use client";
import React, { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { BackgroundGradient } from "@/app/_components/ui/background-gradient";
import BackgroundDot from "@/app/_components/ui/background-dot";
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas/auth";
import { signUp } from "@/app/_actions/signup";
import FormAlert from "./alert";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AlertType } from "@/types";


const SignupForm = () => {
  const mobile = useMediaQuery("(max-width:640px)")

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<AlertType | null>(null);
  const [success, setSuccess] = useState<AlertType | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] =
    useState<boolean>(false);

  const router = useRouter();

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
    setSuccess(null);
    startTransition(async () => {
      const res = await signUp(values);
      if (res?.error) {
        // setSuccess({
        //   status:"success",
        //   message:"Successfully signed up!",
        //   desc:"Email verification has been sent to " + res.data.email
        // })
        setError({
          status: "error",
          message: res?.error as string,
          desc: "Try another one!",
        });
      }
    });
  }
  return (
    <BackgroundDot>
      <BackgroundGradient
        containerClassName="w-[85%] sm:w-3/4 md:w-1/2 lg:w-1/3"
        className=" w-full rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
      >
        <p className="mb-8 text-center text-base font-semibold md:text-lg lg:text-xl">
          Create an account!
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 md:space-y-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs sm:text-sm md:h-10 "
                      placeholder="John Doe"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm ">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs sm:text-sm md:h-10 "
                      placeholder="johndoe12"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm ">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs sm:text-sm md:h-10 "
                      placeholder="johndoe@mail.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm ">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-8 text-xs sm:text-sm md:h-10 "
                        type={passwordVisible ? "text" : "password"}
                        placeholder="******"
                        {...field}
                      />
                      <Button
                        onClick={() => setPasswordVisible((prev) => !prev)}
                        type="button"
                        variant={"outline"}
                        className="absolute  bottom-0 right-0 cursor-pointer text-input h-full"
                      >
                        {passwordVisible ? <EyeOff size={mobile?16:22} /> : <Eye size={mobile?16:22} />}
                      </Button>
                    </div>
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
                  <FormLabel className="text-xs sm:text-sm ">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-8 text-xs sm:text-sm md:h-10 "
                        type={passwordConfirmVisible ? "text" : "password"}
                        placeholder="******"
                        {...field}
                      />
                      <Button
                        onClick={() =>
                          setPasswordConfirmVisible((prev) => !prev)
                        }
                        type="button"
                        variant={"outline"}
                        className="absolute  bottom-0 right-0 cursor-pointer text-input h-full"
                      >
                        {passwordConfirmVisible ?<EyeOff size={mobile?16:22} /> : <Eye size={mobile?16:22} />}
                      </Button>
                    </div>
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
                  <FormLabel className="text-xs sm:text-sm ">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs sm:text-sm md:h-10 "
                      type="text"
                      placeholder="Medan"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormAlert alert={success || error} />
            <Button
              type="submit"
              className="w-full text-xs sm:text-sm h-8 md:h-10"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign up
            </Button>

            <p className="text-xs sm:text-sm ">
              Already have an account?{" "}
              <Button
                variant={"link"}
                className="p-0 text-xs sm:text-sm"
                type="button"
                onClick={() => router.push("/auth/signin")}
              >
                Sign in
              </Button>
            </p>
          </form>
        </Form>
      </BackgroundGradient>
    </BackgroundDot>
  );
};

export default SignupForm;
