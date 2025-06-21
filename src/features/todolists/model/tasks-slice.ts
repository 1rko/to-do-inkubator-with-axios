import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums/enums.ts"
import { RootState } from "@/app/store"

/*export type Task = {
  id: string
  title: string
  isDone: boolean
}*/

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    /*  deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
                      const { todolistId, taskId } = action.payload
                      let foundedTaskIndex = state[todolistId].findIndex((task) => task.id === taskId)
                      if (foundedTaskIndex !== -1) {
                        state[todolistId].splice(foundedTaskIndex, 1)
                      }
                    }),*/
    /* createTaskAC: create.preparedReducer(
                      (payload: { todolistId: string; title: string }) => ({
                        payload: { todolistId: payload.todolistId, title: payload.title, id: nanoid() },
                      }),
                      (state, action) => {
                        const newTask: Task = { title: action.payload.title, isDone: false, id: action.payload.id }
                        state[action.payload.todolistId]?.unshift(newTask)
                      },
                    ),*/
    /* changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
          const { todolistId, taskId, isDone } = action.payload
          let foundedTaskIndex = state[todolistId].findIndex((task) => task.id === taskId)
          if (foundedTaskIndex !== -1) {
            state[todolistId][foundedTaskIndex].isDone = isDone
          }
        }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const { todolistId, taskId, title } = action.payload
      let foundedTaskIndex = state[todolistId].findIndex((task) => task.id === taskId)
      if (foundedTaskIndex !== -1) {
        state[todolistId][foundedTaskIndex].title = title
      }
    }),*/
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })

      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        const { tasks, todolistId } = action.payload
        const newTasks = tasks.map((task) => ({ ...task, isDone: false }))
        state[todolistId] = [...newTasks]
      })

      .addCase(createTaskTC.fulfilled, (state, action) => {
        const newTask = { ...action.payload }
        state[action.payload.todoListId]?.unshift(newTask)
      })

      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const { todolistId, taskId } = action.payload
        let foundedTaskIndex = state[todolistId].findIndex((task) => task.id === taskId)
        if (foundedTaskIndex !== -1) {
          state[todolistId].splice(foundedTaskIndex, 1)
        }
      })

      .addCase(changeTaskStatusTC.fulfilled, (state, action) => {
        const { todoListId, id, status } = action.payload
        let foundedTaskIndex = state[todoListId].findIndex((task) => task.id === id)
        if (foundedTaskIndex !== -1) {
          state[todoListId][foundedTaskIndex].status = status
          state[todoListId][foundedTaskIndex].isDone = status !== 0
        }
      })

      .addCase(changeTaskTitleTC.fulfilled, (state, action) => {
        const { todoListId, id, title } = action.payload
        let foundedTaskIndex = state[todoListId].findIndex((task) => task.id === id)
        if (foundedTaskIndex !== -1) {
          state[todoListId][foundedTaskIndex].title = title
        }
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const fetchTasksTC = createAsyncThunk(
  `${tasksSlice.name}/fetchTasksTC`,
  async (payload: { todolistId: string }, thunkAPI) => {
    try {
      const res = await tasksApi.getTasks(payload.todolistId)
      return { tasks: res.data.items, todolistId: payload.todolistId }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createTaskTC = createAsyncThunk(
  `${tasksSlice.name}/createTaskTC`,
  async (payload: { todolistId: string; title: string }, thunkAPI) => {
    try {
      const res = await tasksApi.createTask({ todolistId: payload.todolistId, title: payload.title })
      return res.data.data.item
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const deleteTaskTC = createAsyncThunk(
  `${tasksSlice.name}/deleteTaskTC`,
  async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
    try {
      await tasksApi.deleteTask({ todolistId: payload.todolistId, taskId: payload.taskId })
      return payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const changeTaskStatusTC = createAsyncThunk(
  `${tasksSlice.name}/changeTaskStatusTC`,
  async (payload: { todolistId: string; taskId: string; isDone: boolean }, thunkAPI) => {
    const { todolistId, taskId, isDone } = payload
    const state = thunkAPI.getState() as RootState

    try {
      const task: UpdateTaskModel | undefined = state.tasks[todolistId].find((t) => t.id === taskId)

      if (!task) {
        return thunkAPI.rejectWithValue("Task not found")
      }

      // Создаём модель для обновления
      const model: UpdateTaskModel = {
        status: isDone ? TaskStatus.Completed : TaskStatus.New,
        title: task.title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
      }

      const res = await tasksApi.updateTask({ todolistId: payload.todolistId, taskId: payload.taskId, model })
      return res.data.data.item
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const changeTaskTitleTC = createAsyncThunk(
  `${tasksSlice.name}/changeTaskTitleTC`,
  async (payload: { todolistId: string; taskId: string; title: string }, thunkAPI) => {
    const { todolistId, taskId, title } = payload
    const state = thunkAPI.getState() as RootState

    try {
      const task: UpdateTaskModel | undefined = state.tasks[todolistId].find((t) => t.id === taskId)

      if (!task) {
        return thunkAPI.rejectWithValue("Task not found")
      }

      // Создаём модель для обновления
      const model: UpdateTaskModel = {
        status: task.status,
        title: title,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
      }

      const res = await tasksApi.updateTask({ todolistId: payload.todolistId, taskId: payload.taskId, model })
      return res.data.data.item
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const {} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
