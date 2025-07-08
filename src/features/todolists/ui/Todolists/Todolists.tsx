import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"

import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import {
  fetchTodolistsTC,
  reorderTodolistAC,
  reorderTodolistTC,
  selectTodolists,
  optimisticSetReorderedTodolistsAC,
} from "../../model/todolists-slice"
import { useEffect } from "react"
import { SortableItem } from "@/features/todolists/ui/Todolists/TodolistItem/SortableItem.tsx"

export const Todolists = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTodolistsTC())
  }, [])

  const todolists = useAppSelector(selectTodolists)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = todolists.findIndex((task) => task.id === active.id)
      const newIndex = todolists.findIndex((task) => task.id === over.id)
      const putAfterItemId = todolists[newIndex - 1]?.id || null //putAfterItemId - id тудулиста, расположенного перед измененным местом
      const newTodolists = arrayMove(todolists, oldIndex, newIndex) //весь массив с измененными местами тудулистов
/*

      console.log("todolists ", todolists)
      console.log("active.id ", active.id)
      console.log("over.id ", over.id)
      console.log("putAfterItemId ", putAfterItemId)
*/

      dispatch(
        reorderTodolistTC({
          aciveId: active.id,
          putAfterItemId: putAfterItemId,
          newOrderedTodolists: newTodolists,
          prevTodolists: todolists,
        }),
      )
    }
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todolists} strategy={rectSortingStrategy}>
          {todolists.map((todolist) => (
            <SortableItem key={todolist.id} id={todolist.id}>
              <Grid key={todolist.id}>
                <Paper sx={{ p: "0 20px 20px 20px" }}>
                  <TodolistItem todolist={todolist} />
                </Paper>
              </Grid>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </>
  )
}
