import { _tasksApi } from "@/features/todolists/api/tasksApi.ts"
import {
  DomainTask,
  domainTaskSchema,
  getTasksResponseSchema,
  taskOperationResponseSchema,
  UpdateTaskModel,
  updateTaskModelSchema,
} from "@/features/todolists/api/tasksApi.types.ts"
import { RootState } from "@/app/store"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice.ts"
//import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { defaultResponseSchema, RequestStatus } from "@/common/types"
import { CLEAR_DATA } from "@/common/actions"

export type Task = DomainTask & {
  entityStatus: RequestStatus
}

export type TasksState = Record<string, Task[]>

/*export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
     /!* .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })*!/
      .addCase(CLEAR_DATA, (_state, _action) => {
        return {}
      })
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (payload: { todolistId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await _tasksApi.getTasks(payload.todolistId)
          domainTaskSchema.array().parse(res.data.items) // 💎
          getTasksResponseSchema.parse(res.data) // 💎
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId: payload.todolistId }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { tasks, todolistId } = action.payload
          state[todolistId] = tasks.map((task) => ({ ...task, entityStatus: "idle" }))
        },
      },
    ),

    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await _tasksApi.createTask({ todolistId: payload.todolistId, title: payload.title })
          taskOperationResponseSchema.parse(res.data) // 💎 ZOD
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return res.data.data.item
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = { ...action.payload }
          state[action.payload.todoListId]?.unshift({ ...newTask, entityStatus: "idle" })
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        const { todolistId, taskId } = payload
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "loading" }))
          const res = await _tasksApi.deleteTask({ todolistId, taskId: payload.taskId })
          defaultResponseSchema.parse(res.data) // 💎 ZOD
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "succeeded" }))
            return payload
          } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "failed" }))
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          dispatch(changeTaskEntityStatusAC({ todolistId, taskId, status: "failed" }))
          return rejectWithValue(error)
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
            dispatch(setAppErrorAC({ error: "Task not found" }))
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

          const res = await _tasksApi.updateTask({
            todolistId: payload.todolistId,
            taskId: payload.taskId,
            model,
          })
          updateTaskModelSchema.parse(res.data.data.item) //💎
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todoListId, id } = action.payload.task
          let foundedTaskIndex = state[todoListId].findIndex((task) => task.id === id)
          if (foundedTaskIndex !== -1) {
            state[todoListId][foundedTaskIndex] = { ...action.payload.task, entityStatus: "idle" }
          }
        },
      },
    ),
    changeTaskEntityStatusAC: create.reducer<{ todolistId: string; taskId: string; status: RequestStatus }>(
      (state, action) => {
        const { todolistId, taskId, status } = action.payload
        const index = state[todolistId].findIndex((task) => task.id === taskId)
        if (index !== -1) {
          state[todolistId][index].entityStatus = status
        }
      },
    ),
  }),
})

export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC, changeTaskEntityStatusAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors*/
