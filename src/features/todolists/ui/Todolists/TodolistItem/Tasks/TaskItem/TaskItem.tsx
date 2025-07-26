import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { TaskStatus } from "@/common/enums/enums.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"

type Props = {
  task: DomainTask
  todolistId: string
  disabled: boolean
}

export const TaskItem = ({ task, todolistId, disabled }: Props) => {
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTaskMutation] = useDeleteTaskMutation()

  const createUpdateModel = (rewritedModelItems: Partial<UpdateTaskModel>) => {
    const model: UpdateTaskModel = {
      status: task.status,
      title: task.title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      ...rewritedModelItems,
    }
    return model
  }

  const deleteTask = () => {
    deleteTaskMutation({ todolistId, taskId: task.id })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createUpdateModel({ status })
    updateTask({ taskId: task.id, todolistId: todolistId, model })
  }

  const changeTaskTitle = (title: string) => {
    const model = createUpdateModel({ title })
    updateTask({ taskId: task.id, todolistId: todolistId, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={disabled} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>
      <IconButton onClick={deleteTask} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
