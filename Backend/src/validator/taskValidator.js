import { z } from "zod";

export const createTaskSchema = z.object({
  project_id: z.string().uuid("Invalid project_id"),
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title is too long"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignee_id: z.string().uuid("Invalid assignee_id").optional().nullable(),
  due_date: z.string().date().optional().nullable(),
  position: z.number().int().optional(),
});
export const updateTaskSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignee_id: z.string().uuid().optional().nullable(),
  due_date: z.string().date().optional().nullable(),
  position: z.number().int().optional(),
});
