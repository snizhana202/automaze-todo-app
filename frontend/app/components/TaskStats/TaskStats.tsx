interface TaskStatsProps {
  total: number;
  completed: number;
}

export function TaskStats({ total, completed }: TaskStatsProps) {
  const pending = total - completed;
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="stat-card">
        <span className="block text-xl font-bold text-indigo-400">{total}</span>
        <span className="text-[10px] uppercase text-slate-400">Total</span>
      </div>
      <div className="stat-card">
        <span className="block text-xl font-bold text-emerald-400">
          {completed}
        </span>
        <span className="text-[10px] uppercase text-slate-400">Completed</span>
      </div>
      <div className="stat-card">
        <span className="block text-xl font-bold text-amber-400">
          {pending}
        </span>
        <span className="text-[10px] uppercase text-slate-400">Pending</span>
      </div>
    </div>
  );
}
