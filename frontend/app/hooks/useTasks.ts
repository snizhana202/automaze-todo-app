import { useState, useEffect, useMemo } from "react";
import { Task } from "../types/types";
import { SortOption } from "@/app/components/TaskFilters/TaskFilters";

export function useTasks() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const refreshTasks = async () => {
    if (!API_URL) {
      console.error("Error: API_URL is not defined in environment variables");
      return;
    }

    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

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

  const addTask = async (
    title: string,
    description: string,
    priority: number,
    dueDate: string | null = null,
    category: string | null = null,
  ) => {
    if (!API_URL) {
      console.error("API_URL is not defined");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      title,
      description: description.trim() ? description : null,
      priority,
      is_completed: false,
      due_date: dueDate,
      category: category,
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) await refreshTasks();
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (task: Task) => {
    const payload = { ...task, is_completed: !task.is_completed };
    try {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, is_completed: !t.is_completed } : t,
          ),
        );
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
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
        return b.id - a.id;
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
  };
}
