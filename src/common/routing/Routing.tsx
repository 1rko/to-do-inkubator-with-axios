import { Main } from "@/app/Main"
import { Route, Routes } from "react-router"
import { Login } from "@/features/features/auth/ui/Login/Login.tsx"
import { PageNotFound } from "@/common/components/PageNotFound/PageNotFound.tsx"

export const Path = {
  Main: "/",
  Login: "/Login",
  NotFound: "*",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Login} element={<Login />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
