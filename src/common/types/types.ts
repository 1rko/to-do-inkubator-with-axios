import { z } from "zod/v4"
import { ResultCode } from "@/common/enums/enums.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"

const fieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
})

export const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    data: dataSchema,
    resultCode: z.enum(ResultCode),
    messages: z.array(z.string()),
    fieldsErrors: z.array(fieldErrorSchema),
  })
}


// Создаем тип для базового ответа с возможностью указания типа данных
export type BaseResponse<T = {}> = z.infer<ReturnType<typeof baseResponseSchema<z.ZodType<T>>>>

// Дефолтная схема для ответа без данных
export const defaultResponseSchema = baseResponseSchema(z.object({}))

//export type BaseResponse = z.infer<typeof defaultResponseSchema>

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export type Task = DomainTask & {
  entityStatus: RequestStatus
}

