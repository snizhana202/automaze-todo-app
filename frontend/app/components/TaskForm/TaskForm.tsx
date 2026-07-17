import { useState } from "react";
import { Button, Input, Textarea, Select, Label } from "../UI/UI";
import { Plus, Zap } from "lucide-react";
import { validateTask } from "@/app/utils/validation";
import { DatePicker } from "../DatePicker/DatePicker";
import { TaskFormProps } from "@/app/types/types";

const CATEGORIES = ["None", "Work", "Personal", "Shopping", "Study", "Health"];

export function TaskForm({ onAdd, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("None");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateTask(title, description);
    if (validationError) {
      setError(validationError);
      return;
    }

    await onAdd(
      title.trim(),
      description.trim(),
      priority,
      dueDate ? dueDate : null,
      category !== "None" ? category : null,
    );

    setTitle("");
    setDescription("");
    setPriority(5);
    setDueDate("");
    setCategory("None");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-100">
        <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
        Create Task
      </h2>

      <div>
        <Label>Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Buy some coffee"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
        <DatePicker value={dueDate} onChange={setDueDate} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label>Priority (1-10)</Label>
        <Select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <option key={val} value={val}>
              {val} {val === 1 ? "(Highest)" : val === 10 ? "(Lowest)" : ""}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          "Adding..."
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </span>
        )}
      </Button>
    </form>
  );
}
