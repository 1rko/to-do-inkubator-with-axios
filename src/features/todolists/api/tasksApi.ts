import { instance } from "@/common/instance"
import {
  DomainTask,
  GetTasksResponse,
  getTasksResponseSchema,
  TaskOperationResponse,
  taskOperationResponseSchema,
  UpdateTaskModel,
} from "@/features/todolists/api/tasksApi.types.ts"
import { BaseResponse, defaultResponseSchema, Task } from "@/common/types"
import { baseApi } from "@/app/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], string>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      transformResponse: (response: GetTasksResponse) => {
        let tasks: DomainTask[] = response.items
        return tasks.map((task) => ({ ...task, entityStatus: "idle" }))
      },
      extraOptions: { dataSchema: getTasksResponseSchema },
      providesTags: ["Tasks"],
    }),
    createTask: build.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: ["Tasks"],
    }),
    updateTask: build.mutation<TaskOperationResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: ["Tasks"],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi

export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: string; title: string }) {
    const { todolistId, title } = payload
    return instance.post<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask({ todolistId, taskId, model }: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    return instance.put<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask({ todolistId, taskId }: { todolistId: string; taskId: string }) {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
