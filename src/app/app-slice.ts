import { RequestStatus } from "@/common/types"
import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
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
  }),
})

// action creator достается из appSlice.actions
export const { changeThemeModeAC, setAppStatusAC } = appSlice.actions
// reducer достается из appSlice.reducer
export const appReducer = appSlice.reducer
export const { selectThemeMode, selectStatus } = appSlice.selectors
