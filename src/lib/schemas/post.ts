import { z } from "zod";

export const PostSchema = z.object({
    title: z.string().min(1,"Title shouldn't be empty"),
    desc: z.string(),

  });

export type PostSchemaType = z.infer<typeof PostSchema>
