"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/_components/ui/button";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  ChangePasswordSchema,
  ChangePasswordSchemaType,
} from "@/lib/schemas/auth";
import { changePassword } from "@/app/_actions/change-password";
import FormAlert from "../auth/alert";
import { AlertType } from "@/types";


const ChangePasswordForm = () => {
  const mobile = useMediaQuery("(max-width:640px)");
  const [error, setError] = useState<AlertType | null>(null);
  const [success, setSuccess] = useState<AlertType | null>(null);
  // 1. Define your form.
  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      curPass: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] =
    useState<boolean>(false);
  const [curPasswordVisible, setCurPasswordVisible] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // 2. Define a submit handler.
  function onSubmit(values: ChangePasswordSchemaType) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await changePassword(values);
      console.log(res);
      if (res?.error) {
        setError({
          status: "error",
          message: res?.error as string,
        //   desc: "Please type the correct password",
        });
      } else {
        setSuccess({
          status: "success",
          message: "Successfully signed up!",
        //   desc: "Password changed",
        });
      }

      form.reset();
    });
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
        <FormField
          control={form.control}
          name="curPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="h-8 text-xs sm:text-sm md:h-10 "
                    type={curPasswordVisible ? "text" : "password"}
                    placeholder="******"
                    {...field}
                  />
                  <Button
                    onClick={() => setCurPasswordVisible((prev) => !prev)}
                    type="button"
                    variant={"outline"}
                    className="absolute  bottom-0 right-0 h-full cursor-pointer text-input"
                  >
                    {curPasswordVisible ? (
                      <EyeOff size={mobile ? 16 : 22} />
                    ) : (
                      <Eye size={mobile ? 16 : 22} />
                    )}
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm ">
                New Password
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
                    className="absolute  bottom-0 right-0 h-full cursor-pointer text-input"
                  >
                    {passwordVisible ? (
                      <EyeOff size={mobile ? 16 : 22} />
                    ) : (
                      <Eye size={mobile ? 16 : 22} />
                    )}
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
                    onClick={() => setPasswordConfirmVisible((prev) => !prev)}
                    type="button"
                    variant={"outline"}
                    className="absolute  bottom-0 right-0 h-full cursor-pointer text-input"
                  >
                    {passwordConfirmVisible ? (
                      <EyeOff size={mobile ? 16 : 22} />
                    ) : (
                      <Eye size={mobile ? 16 : 22} />
                    )}
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormAlert alert={success || error} />

        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Change Password
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
