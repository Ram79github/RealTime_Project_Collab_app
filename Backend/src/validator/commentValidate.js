import {z} from 'zod';
export const createCommentSchema = z.object({
  content: z
    .string({ required_error: 'Comment content is required' })
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment is too long'),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment is too long'),
});