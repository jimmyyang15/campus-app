import { z } from "zod";

export const ProfileSchema = z.object({
    fullName: z.string().optional(),
    city: z.string().optional(),
    dob: z.date().optional(),

  });

export type ProfileSchemaType = z.infer<typeof ProfileSchema>
