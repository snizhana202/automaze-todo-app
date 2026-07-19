import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const formatted = value
    ? new Date(value).toLocaleDateString("en-US")
    : "mm/dd/yyyy";

  return (
    <div>
      <Label
        htmlFor="due-date"
        className="text-slate-400 font-medium mb-1.5 block"
      >
        Due Date
      </Label>
      <div className="input-todo relative flex items-center h-10 w-full focus-within:ring-2 focus-within:ring-indigo-500">
        <Input
          id="due-date"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => {
            try {
              (e.target as HTMLInputElement).showPicker?.();
            } catch {}
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
          <span
            className={`text-sm ${value ? "text-slate-200" : "text-slate-500"}`}
          >
            {formatted}
          </span>
          <svg
            className="w-4 h-4 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
