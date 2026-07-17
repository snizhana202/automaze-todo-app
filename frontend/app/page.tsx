"use client";

import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "@/app/components/TaskForm/TaskForm";
import { TaskStats } from "@/app/components/TaskStats/TaskStats";
import { TaskItem } from "@/app/components/TaskItem/TaskItem";
import { Header } from "@/app/components/Header/Header";
import { TaskFilters } from "@/app/components/TaskFilters/TaskFilters";

export default function TodoApp() {
  const {
    tasks,
    totalCount,
    completedCount,
    isLoading,
    isSubmitting,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  return (
    <main className="app-container">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <Header />
          <div className="panel-glass">
            <TaskForm onAdd={addTask} isSubmitting={isSubmitting} />
          </div>
          <TaskStats total={totalCount} completed={completedCount} />
        </div>

        <div className="md:col-span-7 panel-glass-dark flex flex-col min-h-[500px]">
          <TaskFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <div className="flex-1 overflow-y-auto max-h-[420px] space-y-3">
            {isLoading ? (
              <p className="text-center py-20 text-slate-500">Loading...</p>
            ) : tasks.length === 0 ? (
              <p className="text-center py-20 text-slate-500">No tasks found</p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
