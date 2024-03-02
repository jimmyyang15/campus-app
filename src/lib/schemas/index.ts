import {  userExistsByUsername } from "@/app/_actions/auth";
import { errorUtil } from "node_modules/zod/lib/helpers/errorUtil";
import { z } from "zod";
//schema validations 
export const LoginSchema = z.object({
  username: z.string().min(5, {
    message: "Username is should at least contain 5 characters"
  }),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  username: z.string().min(5, {
    message: "Username is should at least contain 5 characters"
  }),
  fullName: z.string().min(1, {
    message: "Name is required!"
  }),
  city: z.string().optional(),

  email: z.string().email({
    message: "Email is required!",
  }),
  password: z
    .string()
    .min(8, "Password should contain at least 8 characters")
    .regex(
      new RegExp(".*[A-Z].*"),
      "Password should contain at least 1 uppercase character"
    )
    .regex(new RegExp(".*\\d.*"), "Password should contain at least 1 digit"),
  confirmPassword: z
    .string()
    .min(8, "Password should contain at least 8 characters")
    .regex(
      new RegExp(".*[A-Z].*"),
      "Password should contain at least 1 uppercase character"
    )
    .regex(new RegExp(".*\\d.*"), "Password should contain at least 1 digit"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});;


//types
export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>