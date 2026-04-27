// modules/post/post.validation.ts
import { z } from 'zod'

export const createRootSchema = z.object({
  value: z.number()
})

export const operationSchema = z.object({
  parentId: z.string(),
  operation: z.enum(['add', 'sub', 'mul', 'div']),
  right: z.number()
})
