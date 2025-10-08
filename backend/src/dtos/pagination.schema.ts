import { z } from 'zod'

// ใช้สำหรับ limit/offset query
export const paginationSchema = z.object({
  limit: z.string().optional(),   // จาก query string
  offset: z.string().optional()   // จาก query string
})

// Type-safe
export type PaginationQuery = z.infer<typeof paginationSchema>