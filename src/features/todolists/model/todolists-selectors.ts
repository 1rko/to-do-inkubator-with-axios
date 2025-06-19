import type { RootState } from "@/app/store"
import type { DomainTodolist } from "./todolists-slice.ts"

export const selectTodolists = (state: RootState): DomainTodolist[] => state.todolists
