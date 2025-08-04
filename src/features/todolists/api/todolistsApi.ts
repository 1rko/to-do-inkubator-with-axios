import { BaseResponse, defaultResponseSchema } from "@/common/types"
import { Todolist, todolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"
import { baseApi } from "@/app/baseApi.ts"
import { DomainTodolist } from "@/features/todolists/lib"

// Define a service using a base URL and expected endpoints
export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => `todo-lists`,
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      extraOptions: { dataSchema: todolistSchema.array() },
      providesTags: ["Todolist"],
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "POST",
        body: { title },
      }),
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: ["Todolist"],
    }),
    changeTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `/todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: ["Todolist"],
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/todo-lists/${id}`,
        method: "DELETE",
      }),
      extraOptions: { dataSchema: defaultResponseSchema },
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} = todolistsApi
