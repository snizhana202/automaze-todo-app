import { Label, Input } from "../UI/UI";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <div>
      <Label>Due Date</Label>
      <div className="relative flex items-center h-10 w-full rounded-xl border border-slate-800 bg-slate-950 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
          className="absolute inset-0 w-full h-full opacity-0 z-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-between px-3 z-10 pointer-events-none">
          <span
            className={`text-sm ${value ? "text-slate-200" : "text-slate-500"}`}
          >
            {value ? new Date(value).toLocaleDateString("en-US") : "dd-mm-yyyy"}
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
