import { z } from "zod/v4"
import { baseResponseSchema } from "@/common/types"

export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.number().int(),
})

export type Todolist = z.infer<typeof todolistSchema>

export const createTodolistResponseSchema = baseResponseSchema(
  z.object({
    item: todolistSchema,
  }),
)
export type TaskOperationResponse = z.infer<typeof createTodolistResponseSchema>
