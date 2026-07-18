"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskItem } from "../TaskItem/TaskItem";
import { Task } from "@/app/types/types";
import { Dispatch, SetStateAction } from "react";
import { SortOption } from "@/app/components/TaskFilters/TaskFilters";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
  onReorder: (tasks: Task[]) => void;
  currentSortBy: SortOption;
  setSortBy: Dispatch<SetStateAction<SortOption>>;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onReorder,
  currentSortBy,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const isManualSort = currentSortBy === "newest" || currentSortBy === "oldest";

  const handleDragStart = () => {
    if (!isManualSort) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isManualSort) return;
    
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    onReorder(newTasks);
  };


  if (!isManualSort) {
    return (
      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
      key={tasks.map(t => t.id).join('-')}
      items={tasks} 
      strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              isDraggable={isManualSort}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
