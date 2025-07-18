import { changeThemeModeAC, selectStatus, selectThemeMode } from "@/app/app-slice.ts"
import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { containerSx } from "@/common/styles/container.styles"
import { getTheme } from "@/common/theme/theme"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import LinearProgress from "@mui/material/LinearProgress"
import { NavLink } from "react-router"
import { logoutTC, selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"
import { NavButton } from "@/common/components"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logOutHandler = () => {
    dispatch(logoutTC())
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {/* <NavButton>Sign in</NavButton>
            <NavButton>Sign up</NavButton>*/}
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            {isLoggedIn && (
              <NavLink to={"/login"} onClick={logOutHandler}>
                LogOut
              </NavLink>
            )}
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
