import { Description } from "@radix-ui/react-dialog"
import { object, string, z } from "zod"
 
export const loginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(3, "Password must be more than 3 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = object({
   email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(3, "Password must be more than 3 characters")
    .max(32, "Password must be less than 32 characters"),
  phonenumber: string({ required_error: "phone number is required"})
    .min(1, "Phone number is required")
    .min(10, "Phone number must be mor than 10 characters")
    .max(13, 'Phone number must not exceed 13 characters'),
  name: string({ required_error: 'name is required'})
    .min(1, 'full name is required')
    .min(2, 'Name must be more than 2 characters')
    .max(50, 'Name must be not more than 50 characters')
})

const validNames = ['security paper', 'cards']

export const deliverNoteSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .refine(val => validNames.includes(val.toLowerCase()), {
      message: 'Name must be either "security paper" or "cards"',
    }),
  quantity: z
    .number()
    .min(1, { message: 'Should be more than 1' })
    .max(100, { message: 'Should not exceed more than 100 units' }),
  unit: z
    .string()
    .min(4, { message: 'Should be more than 4 characters' })
    .max(15, { message: 'Cannot exceed 15 characters' }),
  category: z
    .string()
    .min(5, { message: 'Should exceed 5 characters' }),
  description: z
    .string()
    .min(5, { message: 'Should exceed five characters' }),
})

// Type inference for TypeScript
export type SignUpFormData = typeof signUpSchema._type
export type LoginFormData = typeof loginSchema._type
export type deliverNoteFormData = typeof deliverNoteSchema._type