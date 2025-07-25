import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { Navigate } from "react-router"
import { Path } from "@/common/routing"
import { useAppSelector } from "@/common/hooks"
import { useCreateTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"
import { selectIsLoggedIn } from "@/app/app-slice.ts"

export const Main = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const [createTodolistMutation, { data, error, isLoading }] = useCreateTodolistMutation()

  const createTodolist = (title: string) => {
    createTodolistMutation(title)
  }

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolist} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
