import { z } from "zod";
// ======================================
//
// ======================================
export const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required" })
    .min(3, "Project name must be at least 3 characters")
    .max(150, "Project name is too long"),
  description: z.string().optional(),
});
// ======================================
export const updateProjectSchema = z.object({
  name: z.string().min(3).max(150).optional(),
  description: z.string().optional(),
  status: z.enum(["active", "archived", "completed"]).optional(),
});
export default{
  createProjectSchema,
  updateProjectSchema
}
