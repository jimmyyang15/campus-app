import { z } from "zod";

export const AssignmentSchema = z.object({
    name:z.string(),
    desc:z.string().optional(),
    file: z.instanceof(File),
    dueDate:z.date()
});

export type AssignmentSchemaType = z.infer<typeof AssignmentSchema>
