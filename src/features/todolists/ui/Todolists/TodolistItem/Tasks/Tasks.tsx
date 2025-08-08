import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { TaskStatus } from "@/common/enums/enums.ts"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { useEffect, useState } from "react"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { DomainTodolist } from "@/features/todolists/lib"
import { TasksPagination } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx"
import { PAGE_SIZE } from "@/common/constants"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter, entityStatus: todolistEntityStatus } = todolist

  const [page, setPage] = useState<number>(1)

  const { data, isLoading } = useGetTasksQuery({
    todolistId: id,
    params: { page: page },
  })

  let todolistTasks = data?.items || []

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

  if (isLoading) {
    ;<TasksSkeleton />
  }

  const paginashionIsShown = PAGE_SIZE < (data?.totalCount || 0)

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
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
          {paginashionIsShown && (
            <TasksPagination page={page} totalCount={data?.totalCount || 0} setPage={setPage} />
          )}
        </>
      )}
    </>
  )
}
