import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router"
import { Path } from "@/common/routing"

type Props = {
  children?: ReactNode
  isAllowed: boolean
  redirectPath?: string
}

export const ProtectedRoute = ({ isAllowed, children, redirectPath = Path.Login }: Props) => {

  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return  children ?? <Outlet />
}
