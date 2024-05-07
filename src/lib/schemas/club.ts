import { z } from "zod";

export const ClubSchema = z.object({
    name: z.string().min(1,"Name shouldn't be empty"),
    desc: z.string().optional(),
    mentorId:z.string(),

  });

export type ClubSchemaType = z.infer<typeof ClubSchema>
