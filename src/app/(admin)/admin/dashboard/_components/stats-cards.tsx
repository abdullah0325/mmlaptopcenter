export function StatsCards({ stats }: { stats: Array<{ label: string; value: number; color: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="rounded-2xl border border-[#d8a928]/20 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-xs uppercase tracking-wide text-[#5A5E55] sm:text-sm">{item.label}</p>
          <p className="mt-1 text-2xl font-bold sm:mt-3 sm:text-4xl" style={{ color: item.color }}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
