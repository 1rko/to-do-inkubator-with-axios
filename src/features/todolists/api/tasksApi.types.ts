import { z } from "zod/v4"
import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"
import { baseResponseSchema } from "@/common/types"

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.iso.datetime({ local: true }),
})

export type DomainTask = z.infer<typeof domainTaskSchema>

export const getTasksResponseSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int(),
  items: z.array(domainTaskSchema),
})

export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>

export const TaskWithEntityStatusSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.iso.datetime({ local: true }),
  entityStatus: z.string(),
})

export const getTasksWithEntityStatusSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int(),
  items: z.array(TaskWithEntityStatusSchema),
})

export type GetTasksWithEntityStatus = z.infer<typeof getTasksWithEntityStatusSchema>

//export type TaskWithEntityStatus = DomainTask & { entityStatus: "idle" }

export const updateTaskModelSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
})

export type UpdateTaskModel = z.infer<typeof updateTaskModelSchema>

//Create and update tasks
export const taskOperationResponseSchema = baseResponseSchema(
  z.object({
    item: domainTaskSchema,
  }),
)
export type TaskOperationResponse = z.infer<typeof taskOperationResponseSchema>
