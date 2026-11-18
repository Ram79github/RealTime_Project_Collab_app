import {z}from 'zod';

const addMemberSchema = z.object({
    email:z.string().email('valid email is required'),
    role:z.enum(['admin','member','viewer']).default('member'),
    
})

const updateMemberSchema =z.object({
    role:z.enum(['admin','member','viewer']),
})

export default {
    addMemberSchema,
     updateMemberSchema
}