import {
  DomainTask,
  GetTasksResponse,
  getTasksResponseSchema, GetTasksWithEntityStatus,
  TaskOperationResponse,
  taskOperationResponseSchema,
  UpdateTaskModel
} from "@/features/todolists/api/tasksApi.types.ts"
import { BaseResponse, defaultResponseSchema } from "@/common/types"
import { baseApi } from "@/app/baseApi.ts"
import { PAGE_SIZE } from "@/common/constants"

//type TaskWithEntityStatus = DomainTask & { entityStatus: "idle" }

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksWithEntityStatus, { todolistId: string; params: { page: number } }>({
      query: ({ todolistId, params }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        params: { ...params, count: PAGE_SIZE },
      }),
      extraOptions: { dataSchema: getTasksResponseSchema },
      transformResponse: (response: GetTasksResponse): GetTasksWithEntityStatus => {
        const tasks: DomainTask[] = response.items
        const newTasks = tasks.map((task) => ({ ...task, entityStatus: "idle" }))
        return { ...response, items: [...newTasks] }
      },
      providesTags: (res, _err, { todolistId }) =>
        res
          ? [...res.items.map(({ id }) => ({ type: "Tasks", id }) as const), { type: "Tasks", id: todolistId }]
          : ["Tasks"],
    }),

    createTask: build.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Tasks", id: todolistId }],
    }),

    updateTask: build.mutation<TaskOperationResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), 'getTasks')

        let patchResults: any[] = []
        cachedArgsForQuery.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData(
                'getTasks',
                { todolistId, params: { page: params.page } },
                state => {
                  const index = state.items.findIndex(task => task.id === taskId)
                  if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...model }
                  }
                }
              )
            )
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach(patchResult => {
            patchResult.undo()
          })
        }
      },
      extraOptions: { dataSchema: taskOperationResponseSchema },
      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),

    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ todolistId, taskId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', { todolistId, params: {page:1} }, state => {
            const index = state.items.findIndex(task => task.id === taskId)
            if (index !== -1) {
              state.items.splice(index, 1)
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi

