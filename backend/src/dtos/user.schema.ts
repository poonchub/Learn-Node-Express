import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>