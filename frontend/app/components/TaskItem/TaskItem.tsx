import { Task } from "@/app/types/types";
import { Trash2, Calendar, Check } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
  isDraggable?: boolean;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  isDraggable,
}: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor =
    task.priority <= 3
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : task.priority <= 7
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-slate-500/10 text-slate-400 border-slate-500/20";

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.is_completed;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <button
          onClick={() => onToggle(task)}
          className={`task-checkbox ${
            task.is_completed
              ? "bg-emerald-500 border-emerald-500 text-slate-900"
              : "border-slate-600 hover:border-indigo-400"
          }`}
        >
          {task.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold ${task.is_completed ? "line-through text-slate-500" : "text-slate-200"}`}
            >
              {task.title}
            </h3>
            {task.category && (
              <span className="px-2 py-0.5 text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                {task.category}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 mt-1 break-words">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap mt-2">
            <span
              className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${priorityColor}`}
            >
              Priority: {task.priority}
            </span>

            {task.due_date && (
              <span
                className={`text-[10px] font-medium flex items-center gap-1 ${isOverdue ? "text-rose-400 font-bold" : "text-slate-400"}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {isOverdue ? "Overdue: " : "Due: "}
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="btn-delete"
        title="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
