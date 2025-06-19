import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const { todolistId, taskId } = action.payload
      let foundedTaskIndex = state[todolistId].findIndex((task) => task.id === taskId)
      if (foundedTaskIndex !== -1) {
        state[todolistId].splice(foundedTaskIndex, 1)
      }
    }),
    createTaskAC: create.preparedReducer(
      (payload: { todolistId: string; title: string }) => ({
        payload: { todolistId: payload.todolistId, title: payload.title, id: nanoid() },
      }),
      (state, action) => {
        const newTask: Task = { title: action.payload.title, isDone: false, id: action.payload.id }
        state[action.payload.todolistId].unshift(newTask)
      },
    ),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
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
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const { deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
