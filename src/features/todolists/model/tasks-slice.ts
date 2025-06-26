import { createAsyncThunk } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { RootState } from "@/app/store"
import { createAppSlice, isCompleted } from "@/common/utils"

/*export type Task = {
  id: string
  title: string
  isDone: boolean
}*/

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (payload: { todolistId: string }, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(payload.todolistId)
          return { tasks: res.data.items, todolistId: payload.todolistId }
        } catch (error) {
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { tasks, todolistId } = action.payload
          //const newTasks = tasks.map((task) => ({ ...task}))
          state[todolistId] = [...tasks]
        },
      },
    ),

    changeTaskStatusTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string; isDone: boolean }, thunkAPI) => {
        const { todolistId, taskId, isDone } = payload
        const state = thunkAPI.getState() as RootState

        try {
          const task = state.tasks[todolistId].find((task) => task.id === taskId)

          if (task) {
            // Создаём модель для обновления - можно перечислить все поля
            /*const model: UpdateTaskModel = {
                          status: isCompleted(isDone),
                          title: task.title,
                          deadline: task.deadline,
                          description: task.description,
                          priority: task.priority,
                          startDate: task.startDate,
                        }*/

            // Создаём модель для обновления - а можно в нужной таске, найденной по id, заменить поле status
            const model: UpdateTaskModel = { ...task, status: isCompleted(isDone) }

            const res = await tasksApi.updateTask({
              todolistId: payload.todolistId,
              taskId: payload.taskId,
              model,
            })
            return res.data.data.item
          } else {
            return thunkAPI.rejectWithValue(null)
          }
        } catch (error) {
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todoListId, id, status } = action.payload
          let foundedTaskIndex = state[todoListId].findIndex((task) => task.id === id)
          if (foundedTaskIndex !== -1) {
            state[todoListId][foundedTaskIndex].status = status
            //state[todoListId][foundedTaskIndex].isDone = status !== 0
          }
        },
      },
    ),
  }),

  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
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

export const { fetchTasksTC, changeTaskStatusTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
