import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { fetchTodolistsTC, selectTodolists } from "../../model/todolists-slice"
import { useEffect } from "react"

export const Todolists = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [])

  const todolists = useAppSelector(selectTodolists)

  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
