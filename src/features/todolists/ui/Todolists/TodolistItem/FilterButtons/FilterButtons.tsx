import { containerSx } from "@/common/styles/"
import { type DomainTodolist, type FilterValues } from "@/features/todolists/model/todolists-slice.ts"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { useAppDispatch } from "@/common/hooks"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    //dispatch(changeTodolistFilterAC({ id, filter }))
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
            state[index].filter = filter
          }
        },
      ),
    )
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
