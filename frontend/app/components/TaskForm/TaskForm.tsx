import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Zap } from "lucide-react";
import { TaskSchema, TaskFormData } from "@/app/utils/validation";
import { DatePicker } from "../DatePicker/DatePicker";

interface TaskFormProps {
  onAdd: (data: TaskFormData) => Promise<void>;
  isSubmitting: boolean;
}

const CATEGORIES = ["None", "Work", "Personal", "Shopping", "Study", "Health"];

const LABEL_STYLES = "text-slate-400 font-medium mb-1.5 block";

export function TaskForm({ onAdd, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<string | null>("None");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    const formData = {
      title,
      description: description.trim() === "" ? null : description,
      priority,
      due_date: dueDate || null,
      category: category !== "None" ? category : null,
    };

    const result = TaskSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    await onAdd(result.data);

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
        <Label htmlFor="task-title" className={LABEL_STYLES}>
          Title
        </Label>
        <Input
          className="input-todo"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Buy some coffee"
          required
        />
      </div>

      <div>
        <Label htmlFor="task-description" className={LABEL_STYLES}>
          Description
        </Label>
        <Textarea
          className="input-todo resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className={LABEL_STYLES}>Category</Label>
          <Select value={category ?? undefined} onValueChange={setCategory}>
            <SelectTrigger className="select-priority w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent 
            className="bg-slate-950 border-slate-700 text-slate-200 min-w-0"
            alignItemWithTrigger={false}
            >
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DatePicker value={dueDate} onChange={setDueDate} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label className="text-slate-400 font-medium">Priority (1-10)</Label>
        <Select
          value={priority.toString()}
          onValueChange={(val) => setPriority(Number(val))}
        >
          <SelectTrigger className="select-priority w-[180px]">
            <SelectValue placeholder="5" />
          </SelectTrigger>
          <SelectContent 
          className="bg-slate-950 border-slate-700 text-slate-200 min-w-0" 
          alignItemWithTrigger={false}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
              <SelectItem key={val} value={val.toString()}>
                {val} {val === 1 ? "(Highest)" : val === 10 ? "(Lowest)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          {error}
        </div>
      )}

      <Button className="btn-submit" type="submit" disabled={isSubmitting}>
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
