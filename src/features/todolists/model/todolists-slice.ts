import { createAsyncThunk } from "@reduxjs/toolkit"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { fetchTasksTC } from "@/features/todolists/model/tasks-slice.ts"
import { createAppSlice } from "@/common/utils"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = {
  id: string
  title: string
  filter: FilterValues
} & { filter: FilterValues }

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  extraReducers: (builder) => {
    builder
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (_state, action) => {
        if (action.payload) {
          console.error("Ошибка при загрузке тудулистов:", action.payload)
        }
      })

      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload, filter: "all" })
      })
      .addCase(createTodolistTC.rejected, (_state, action) => {
        if (action.payload) {
          console.error("Ошибка при загрузке тудулистов:", action.payload)
        }
      })

      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(deleteTodolistTC.rejected, (_state, action) => {
        if (action.payload) {
          console.error("Ошибка при загрузке тудулистов:", action.payload)
        }
      })
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          const res = await todolistsApi.getTodolists()
          const todolists = res.data
          todolists.forEach((todolist) => {
            thunkAPI.dispatch(fetchTasksTC({ todolistId: todolist.id }))
          })
          return { todolists: res.data }
        } catch (error) {
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all" })
          })
        },
      },
    ),

    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string; title: string }, thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkAPI) => {
    try {
      const res = await todolistsApi.createTodolist(title)
      console.log(res.data.data.item)
      return res.data.data.item
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (payload: { id: string }, thunkAPI) => {
    try {
      await todolistsApi.deleteTodolist(payload.id)
      return payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const { changeTodolistFilterAC, fetchTodolistsTC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
