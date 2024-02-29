import { z } from "zod";

//schema validations 
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(1,{
    message:"Name is required!"
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
});


//types
export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>