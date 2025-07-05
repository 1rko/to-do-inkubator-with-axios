import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { containerSx } from "@/common/styles/"
import {
  changeTodolistFilterAC,
  type FilterValues,
  type DomainTodolist,
} from "@/features/todolists/model/todolists-slice.ts"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(changeTodolistFilterAC({ id, filter }))
  }
  //inert в Box - блокирует кнопки, если todolist.entityStatus === "loading"
  return (
    <Box sx={containerSx} inert={entityStatus === "loading"}>
      <Button variant={filter === "all" ? "outlined" : "text"} color={"inherit"} onClick={() => changeFilter("all")}>
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilter("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
