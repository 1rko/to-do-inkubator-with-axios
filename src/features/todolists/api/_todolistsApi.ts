import { instance } from "@/common/instance"
import { BaseResponse } from "@/common/types"
import { TaskOperationResponse, Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { AUTH_TOKEN } from "@/common/constants"

// Define a service using a base URL and expected endpoints
export const todolistsApi = createApi({
  reducerPath: "todolistsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("API-KEY", import.meta.env.VITE_API_KEY)
      headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
    },
  }),
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => `todo-lists`,
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
    }),
  }),
})

export const { useGetTodolistsQuery } = todolistsApi



export const _todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { title, id } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
  createTodolist(title: string) {
    return instance.post<TaskOperationResponse>("/todo-lists", { title })
  },
}
