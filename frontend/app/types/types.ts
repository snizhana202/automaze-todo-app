export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: number;
  due_date?: string | null;
  category?: string | null;
}

export interface TaskFormProps {
  onAdd: (
    title: string,
    description: string,
    priority: number,
    dueDate: string | null,
    category: string | null,
  ) => Promise<void>;
  isSubmitting: boolean;
}
