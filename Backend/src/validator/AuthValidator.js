import {z}from 'zod';

export const registerSchema = z.object({
    email: z.string().email("Inavalid email address"),
    password:z.string().min(8,'Password must be at least 8  characters').max(100),
    full_name:z.string().min(2,'Full nmae is required').max(100),
});

export const loginSchema= z.object({
    email: z.string().email("Invalid email required"),
    password: z.string().min(1,'Password is required'),
})