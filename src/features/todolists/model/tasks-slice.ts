import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { RootState } from "@/app/store"
import { createAppSlice } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (payload: { todolistId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(payload.todolistId)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId: payload.todolistId }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { tasks, todolistId } = action.payload
          state[todolistId] = [...tasks]
        },
      },
    ),

    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask({ todolistId: payload.todolistId, title: payload.title })
          return res.data.data.item
        } catch (error) {
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = { ...action.payload }
          state[action.payload.todoListId]?.unshift(newTask)
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask({ todolistId: payload.todolistId, taskId: payload.taskId })
          return payload
        } catch (error) {
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todolistId, taskId } = action.payload
          let foundedTaskIndex = state[todolistId].findIndex((task) => task.id === taskId)
          if (foundedTaskIndex !== -1) {
            state[todolistId].splice(foundedTaskIndex, 1)
          }
        },
      },
    ),

    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { dispatch, getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel } = payload
        const state = getState() as RootState

        try {
          const task: UpdateTaskModel | undefined = state.tasks[todolistId].find((t) => t.id === taskId)

          if (!task) {
            dispatch(setAppStatusAC({ status: "failed" }))
            return rejectWithValue("Task not found")
          }
          dispatch(setAppStatusAC({ status: "loading" }))
          // Создаём модель для обновления
          const model: UpdateTaskModel = {
            status: task.status,
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            ...domainModel, //перезаписываем полями, которые пришли в payload
          }

          const res = await tasksApi.updateTask({
            todolistId: payload.todolistId,
            taskId: payload.taskId,
            model,
          })
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todoListId, id } = action.payload.task
          let foundedTaskIndex = state[todoListId].findIndex((task) => task.id === id)
          if (foundedTaskIndex !== -1) {
            state[todoListId][foundedTaskIndex] = { ...action.payload.task }
          }
        },
      },
    ),
  }),
})

export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
