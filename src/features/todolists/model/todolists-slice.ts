import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { fetchTasksTC } from "@/features/todolists/model/tasks-slice.ts"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums/enums.ts"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = {
  id: string
  title: string
  addedDate: string
  order: number
} & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          const todolists = res.data
          todolists.forEach((todolist) => {
            dispatch(fetchTasksTC({ todolistId: todolist.id }))
          })
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all", entityStatus: "idle" })
          })
        },
        rejected: () => {
          console.log("Error fetching todolists")
        },
      },
    ),

    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string; title: string }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.changeTodolistTitle(payload)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return payload
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),

    createTodolistTC: create.asyncThunk(
      async (title: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return res.data.data.item
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload, filter: "all", entityStatus: "idle" })
        },
      },
    ),

    deleteTodolistTC: create.asyncThunk(
      async (id: string, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTodolistStatusAC({ id, status: "loading" }))
          const res = await todolistsApi.deleteTodolist(id)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { id }
          } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTodolistStatusAC({ id, status: "failed" }))
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(changeTodolistStatusAC({ id, status: "failed" }))
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),

    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
    changeTodolistStatusAC: create.reducer<{ id: string; status: RequestStatus }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.status
      }
    }),
  }),
})

export const {
  changeTodolistFilterAC,
  fetchTodolistsTC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistStatusAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
