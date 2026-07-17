import { TaskFormData } from "../utils/validation";

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
  onAdd: (data: TaskFormData) => Promise<void>;
  isSubmitting: boolean;
}
