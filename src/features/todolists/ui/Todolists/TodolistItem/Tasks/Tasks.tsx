import type { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { TaskStatus } from "@/common/enums/enums.ts"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { useEffect } from "react"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus: todolistEntityStatus } = todolist

  const { data } = useGetTasksQuery(id)

  let todolistTasks = data || []

  useEffect(() => {
    if (!data) return
  }, [data])

  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              todolistId={id}
              disabled={task?.entityStatus === "loading" || todolistEntityStatus === "loading"}
            />
          ))}
        </List>
      )}
    </>
  )
}
