import { RequestStatus } from "@/common/types"
import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"

export type ThemeMode = "dark" | "light"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isPending,
        (state, action) => {
          if (
            todolistsApi.endpoints.getTodolists.matchPending(action) ||
            tasksApi.endpoints.getTasks.matchPending(action)
          ) {
            return
          }
          state.status = "loading"
        },
      )
      .addMatcher(
        isFulfilled,
        (state, _action) => {
          state.status = "succeeded"
        },
      )
      .addMatcher(
        isRejected,
        (state, _action) => {
          state.status = "failed"
        },
      )
  },
  // reducers состоит из подредьюсеров, эквивалентных одному оператору case в switch
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      // логика в подредьюсерах мутабельная, а иммутабельность достигается благодаря immer.js
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedInAC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
})

// action creator достается из appSlice.actions
export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC, setIsLoggedInAC } = appSlice.actions
// reducer достается из appSlice.reducer
export const appReducer = appSlice.reducer
export const { selectThemeMode, selectStatus, selectAppError, selectIsLoggedIn } = appSlice.selectors
