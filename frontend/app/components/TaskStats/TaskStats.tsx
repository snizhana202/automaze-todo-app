interface TaskStatsProps {
  total: number;
  completed: number;
}

export function TaskStats({ total, completed }: TaskStatsProps) {
  const pending = total - completed;

  const stats = [
    { label: "Total", value: total, color: "text-indigo-400" },
    { label: "Completed", value: completed, color: "text-emerald-400" },
    { label: "Pending", value: pending, color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="stat-card">
          <span className={`block text-xl font-bold ${color}`}>{value}</span>
          <span className="text-[10px] uppercase text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  );
}
