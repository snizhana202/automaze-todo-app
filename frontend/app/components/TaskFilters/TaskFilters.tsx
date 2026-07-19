import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

export type SortOption = "newest" | "oldest" | "priority-asc" | "priority-desc";

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filter: "all" | "active" | "completed";
  setFilter: (val: "all" | "active" | "completed") => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
}

const FILTERS = ["all", "active", "completed"] as const;

export function TaskFilters({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}: TaskFiltersProps) {
  const getSortIcon = () => {
    if (sortBy === "priority-asc")
      return <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />;
    if (sortBy === "priority-desc")
      return <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />;
    return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="input-todo text-sm pl-9"
        />
      </div>

      <div className="flex justify-between items-center gap-4 text-xs">
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "btn-filter-active" : "btn-filter"}
            >
              {f === "all" ? "All" : f === "active" ? "Active" : "Completed"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-800/60">
          {getSortIcon()}
          <span className="text-slate-400 font-medium">Sort:</span>

          <Select
            value={sortBy}
            onValueChange={(val) => setSortBy(val as SortOption)}
          >
            <SelectTrigger data-testid="sort-select" className="w-[140px] h-8 bg-transparent border-none text-slate-200 focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
              <SelectItem value="newest">Date (Newest)</SelectItem>
              <SelectItem value="priority-asc">Priority (1-10)</SelectItem>
              <SelectItem value="priority-desc">Priority (10-1)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
