import { z } from "zod";

export const PostSchema = z.object({
    title: z.string().min(1,"Title shouldn't be empty"),
    desc: z.string().min(1, "Please write some description"),

  });

export type PostSchemaType = z.infer<typeof PostSchema>
