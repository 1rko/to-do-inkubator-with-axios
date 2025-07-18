import { createAction } from "@reduxjs/toolkit"

export const CLEAR_DATA = "common/clearData"

export const clearDataAC = createAction(CLEAR_DATA)