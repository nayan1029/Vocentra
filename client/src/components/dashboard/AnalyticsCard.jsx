function AnalyticsCard({ analytics }) {
  if (!analytics) return null;

  const { totalWorkflows, avgPerDay, mostUsedType, typeBreakdown, dailyCounts } = analytics;

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
        <p className="text-sm text-[var(--text-muted)]">Total Workflows</p>
        <p className="text-3xl font-bold mt-1">{totalWorkflows}</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
        <p className="text-sm text-[var(--text-muted)]">Avg / Day</p>
        <p className="text-3xl font-bold mt-1">{avgPerDay}</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
        <p className="text-sm text-[var(--text-muted)]">Most Used</p>
        <p className="text-lg font-bold mt-1 capitalize">{mostUsedType?.replace(/_/g, " ") || "—"}</p>
      </div>

      {dailyCounts?.length > 0 && (
        <div className="sm:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-3">Last 7 Days</p>
          <div className="flex items-end gap-2 h-24">
            {dailyCounts.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-violet-600 rounded-t transition-all"
                  style={{ height: `${Math.max(d.count * 20, 4)}px` }}
                />
                <span className="text-[10px] text-[var(--text-muted)]">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {typeBreakdown && Object.keys(typeBreakdown).length > 0 && (
        <div className="sm:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <p className="text-sm text-[var(--text-muted)] mb-3">By Type</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeBreakdown).map(([type, count]) => (
              <span key={type} className="px-3 py-1 rounded-full text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {type.replace(/_/g, " ")}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsCard;
