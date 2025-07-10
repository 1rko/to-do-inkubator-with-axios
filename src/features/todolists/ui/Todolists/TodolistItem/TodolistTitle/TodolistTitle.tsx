import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import {
  changeTodolistTitleTC,
  deleteTodolistTC,
  type DomainTodolist,
} from "@/features/todolists/model/todolists-slice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import TextField from "@mui/material/TextField"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const deleteTodolist = () => {
    dispatch(deleteTodolistTC(id))
  }

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleTC({ id, title }))
  }

  return (
    <div className={styles.container}>
      <h3 style={{ zIndex: "5" }}>
        <EditableSpan value={title} onChange={changeTodolistTitle} disabled={entityStatus === "loading"} />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
