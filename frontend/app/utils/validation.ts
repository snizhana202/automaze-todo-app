import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty.")
    .regex(/[a-zA-Z]/, "Title must contain at least one English letter.")
    .regex(/^[a-zA-Z0-9\s.,!?'"\-()]*$/, "Please use English letters only."),
  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => !val || /[a-zA-Z0-9]/.test(val), {
      message: "Description cannot consist only of special characters.",
    }),
  priority: z.number().min(1).max(10),
  due_date: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type TaskFormData = z.infer<typeof TaskSchema>;
