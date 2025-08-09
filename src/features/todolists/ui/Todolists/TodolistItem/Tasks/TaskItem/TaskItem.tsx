import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { TaskStatus } from "@/common/enums/enums.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { tasksApi, useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"
import { RequestStatus } from "@/common/types"
import { useAppDispatch } from "@/common/hooks"

type Props = {
  task: DomainTask
  todolistId: string
  disabled: boolean
}

export const TaskItem = ({ task, todolistId, disabled }: Props) => {
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTaskMutation] = useDeleteTaskMutation()

  const dispatch = useAppDispatch()

  //EntityStatus используется для disable при действиях при медленном интернете
  const changeTaskEntityStatus = (entityStatus: RequestStatus) => {
    dispatch(
      tasksApi.util.updateQueryData(
        // название эндпоинта, в котором нужно обновить кэш
        "getTasks",
        // аргументы для эндпоинта
        { todolistId: todolistId, params: { page: 1 } },
        // `updateRecipe` - коллбэк для обновления закэшированного стейта мутабельным образом
        (state) => {
          const index = state.items.findIndex((t) => t.id === task.id)
          if (index !== -1) {
            state.items[index].entityStatus = entityStatus
          }
        },
      ),
    )
  }

  const deleteTask = () => {
    changeTaskEntityStatus("loading")
    deleteTaskMutation({ todolistId, taskId: task.id})
      .unwrap()
      .catch(() => {
        changeTaskEntityStatus("idle")
      })
  }

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

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createUpdateModel({ status })

    changeTaskEntityStatus("loading")
    updateTask({ taskId: task.id, todolistId: todolistId, model }).finally(() => {
      changeTaskEntityStatus("idle")
    })
  }

  const changeTaskTitle = (title: string) => {
    const model = createUpdateModel({ title })

    changeTaskEntityStatus("loading")
    updateTask({ taskId: task.id, todolistId: todolistId, model }).finally(() => {
      changeTaskEntityStatus("idle")
    })
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
