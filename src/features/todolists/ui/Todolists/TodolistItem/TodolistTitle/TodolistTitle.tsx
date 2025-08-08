import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
  todolistsApi,
  useChangeTodolistTitleMutation,
  useDeleteTodolistMutation,
} from "@/features/todolists/api/todolistsApi.ts"
import { useAppDispatch } from "@/common/hooks"
import { RequestStatus } from "@/common/types"
import { DomainTodolist } from "@/features/todolists/lib"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [changeTodolistTitleMutation] = useChangeTodolistTitleMutation()
  const [deleteTodolistMutation] = useDeleteTodolistMutation()

  const dispatch = useAppDispatch()

  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData(
        // название эндпоинта, в котором нужно обновить кэш
        "getTodolists",
        // аргументы для эндпоинта
        undefined,
        // `updateRecipe` - коллбэк для обновления закэшированного стейта мутабельным образом
        (state) => {
          const index = state.findIndex((todolist) => todolist.id === id)
          if (index !== -1) {
            state[index].entityStatus = entityStatus
          }
        },
      ),
    )
  }

  const deleteTodolist = () => {
    changeTodolistStatus("loading")
    deleteTodolistMutation(id)
      .unwrap()
      .catch(() => {
        changeTodolistStatus("idle")
      })
  }

  const changeTodolistTitle = (title: string) => {
    changeTodolistStatus("loading")
    changeTodolistTitleMutation({ id, title })
      .unwrap()
      .catch(() => {
        changeTodolistStatus("idle")
      })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
