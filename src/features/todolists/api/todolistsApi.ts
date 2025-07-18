import { instance } from "@/common/instance"
import { BaseResponse } from "@/common/types"
import { TaskOperationResponse, Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsApi = {
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
