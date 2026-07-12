function HistoryPanel({ workflows, selectedId, onSelect, onDelete, search, onSearchChange }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 h-full flex flex-col">
      <h3 className="font-semibold mb-4">History</h3>

      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search workflows..."
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {workflows.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No workflows yet</p>
        ) : (
          workflows.map((w) => (
            <div
              key={w.id}
              className={`group rounded-lg p-3 cursor-pointer border transition-colors ${
                selectedId === w.id
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-[var(--border)] hover:border-violet-500/50 bg-[var(--bg-primary)]"
              }`}
              onClick={() => onSelect(w)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{w.title || "Untitled"}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{w.prompt}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(w.createdAt).toLocaleDateString()} · {w.workflowType.replace(/_/g, " ")}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(w.id); }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs p-1 transition-opacity"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPanel;
