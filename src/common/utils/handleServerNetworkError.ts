import axios from "axios"
import type { Dispatch } from "@reduxjs/toolkit"
import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
  } else {
    errorMessage = JSON.stringify(error)
  }
  debugger
  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: "failed" }))
}
