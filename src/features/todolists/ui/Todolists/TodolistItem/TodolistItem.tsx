import { FilterButtons } from "./FilterButtons/FilterButtons"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi.ts"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  //const dispatch = useAppDispatch()

  const [createTaskMutation] = useCreateTaskMutation()

  const createTask = (title: string) => {
    //dispatch(createTaskTC({ todolistId: todolist.id, title }))
    createTaskMutation({ todolistId: todolist.id, title })
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
