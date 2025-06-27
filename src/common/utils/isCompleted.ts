import { TaskStatus } from "@/common/enums/enums.ts"

export const isCompleted = (isDone: Boolean) => (isDone ? TaskStatus.Completed : TaskStatus.New)
