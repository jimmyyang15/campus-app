import { z } from "zod";

export const ClubSchema = z.object({
    name: z.string().min(1,"Name shouldn't be empty"),
    description: z.string().optional(),

  });

export type ClubSchemaType = z.infer<typeof ClubSchema>
