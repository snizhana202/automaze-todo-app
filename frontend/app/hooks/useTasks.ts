import { useState, useEffect, useMemo } from "react";
import { Task } from "../types/types";
import { SortOption } from "@/app/components/TaskFilters/TaskFilters";
import { TaskSchema, TaskFormData } from "@/app/utils/validation";

export function useTasks() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!API_URL) {
        console.error("API_URL is not defined");
        return;
      }
      try {
        setIsLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();

        if (isMounted) {
          setTasks(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading tasks:", err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const addTask = async (data: TaskFormData) => {
    const validationResult = TaskSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.issues);
      return;
    }
    if (!API_URL) return;

    const tempTask: Task = {
      id: Date.now(),
      title: validationResult.data.title,
      description: validationResult.data.description ?? null,
      priority: validationResult.data.priority,
      is_completed: false,
      due_date: validationResult.data.due_date ?? null,
      category: validationResult.data.category ?? null,
      order: tasks.length,
    };

    setTasks((prev) => [tempTask, ...prev]);
    setIsSubmitting(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      if (!res.ok) throw new Error("Server error");

      const savedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? savedTask : t)),
      );
    } catch (err) {
      console.error("Error creating task:", err);
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
      alert("Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t,
      ),
    );

    try {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, is_completed: !task.is_completed }),
      });

      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error("Error updating task:", err);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, is_completed: task.is_completed } : t,
        ),
      );
    }
  };

  const deleteTask = async (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);

    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error("Error deleting task:", err);
      if (taskToDelete) {
        setTasks((prev) => [taskToDelete, ...prev]);
      }
    }
  };

  const reorderTasks = async (reorderedFilteredTasks: Task[]) => {
    setTasks((prevTasks) => {
      const newOrderMap = new Map(
        reorderedFilteredTasks.map((t, index) => [t.id, index]),
      );

      return prevTasks.map((task) => {
        if (newOrderMap.has(task.id)) {
          return { ...task, order: newOrderMap.get(task.id)! };
        }
        return task;
      });
    });

    try {
      await Promise.all(
        reorderedFilteredTasks.map((task, index) =>
          fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...task, order: index }),
          }),
        ),
      );
    } catch (err) {
      console.error("Error reordering tasks:", err);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "active" && !task.is_completed) ||
          (filter === "completed" && task.is_completed);

        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "priority-asc") {
          return a.priority - b.priority;
        }
        if (sortBy === "priority-desc") {
          return b.priority - a.priority;
        }

        return (a.order ?? 0) - (b.order ?? 0);
      });
  }, [tasks, filter, searchQuery, sortBy]);

  const completedCount = tasks.filter((t) => t.is_completed).length;

  return {
    tasks: filteredTasks,
    totalCount: tasks.length,
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
    reorderTasks,
  };
}
