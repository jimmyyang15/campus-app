import { z } from "zod";

export const CommentSchema = z.object({
    comment: z.string().min(1, {
      message: "Comment must be at least 2 characters.",
    }),
  })

export type CommentSchemaType = z.infer<typeof CommentSchema>
