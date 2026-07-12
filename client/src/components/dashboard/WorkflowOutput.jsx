function WorkflowOutput({ result, workflowType }) {
  if (!result) return null;

  const { title, summary, meeting, tasks, email, schedule, phases, priorities, nextSteps, milestones } = result;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-violet-400 font-medium">
            {workflowType?.replace(/_/g, " ")}
          </span>
          <h3 className="text-xl font-bold mt-1">{title || "Generated Workflow"}</h3>
          {summary && <p className="text-[var(--text-muted)] mt-2">{summary}</p>}
        </div>
      </div>

      {meeting && (
        <div className="rounded-xl bg-[var(--bg-primary)] p-4 border border-[var(--border)]">
          <h4 className="font-semibold text-violet-400 mb-3">Meeting</h4>
          <dl className="grid sm:grid-cols-3 gap-3 text-sm">
            {meeting.title && <div><dt className="text-[var(--text-muted)]">Title</dt><dd className="font-medium">{meeting.title}</dd></div>}
            {meeting.date && <div><dt className="text-[var(--text-muted)]">Date</dt><dd className="font-medium">{meeting.date}</dd></div>}
            {meeting.time && <div><dt className="text-[var(--text-muted)]">Time</dt><dd className="font-medium">{meeting.time}</dd></div>}
          </dl>
        </div>
      )}

      {tasks?.length > 0 && (
        <div>
          <h4 className="font-semibold text-violet-400 mb-3">Tasks</h4>
          <ul className="space-y-2">
            {tasks.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-green-400 mt-0.5">✔</span>
                <span>
                  {typeof t === "string" ? t : t.task}
                  {t.priority && <span className="ml-2 text-xs text-[var(--text-muted)]">({t.priority})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {email && (
        <div className="rounded-xl bg-[var(--bg-primary)] p-4 border border-[var(--border)]">
          <h4 className="font-semibold text-violet-400 mb-2">Email Draft</h4>
          <p className="font-medium text-sm">Subject: {email.subject}</p>
          <pre className="mt-3 text-sm whitespace-pre-wrap text-[var(--text-muted)]">{email.body}</pre>
        </div>
      )}

      {schedule?.length > 0 && (
        <div>
          <h4 className="font-semibold text-violet-400 mb-3">Schedule</h4>
          <div className="space-y-2">
            {schedule.map((s, i) => (
              <div key={i} className="flex gap-4 text-sm rounded-lg bg-[var(--bg-primary)] p-3 border border-[var(--border)]">
                <span className="font-medium text-violet-400 min-w-[80px]">{s.time}</span>
                <span>{s.activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {priorities?.length > 0 && (
        <div>
          <h4 className="font-semibold text-violet-400 mb-3">Priorities</h4>
          <ul className="space-y-1 text-sm">
            {priorities.map((p, i) => <li key={i}>• {p}</li>)}
          </ul>
        </div>
      )}

      {phases?.length > 0 && (
        <div>
          <h4 className="font-semibold text-violet-400 mb-3">Phases</h4>
          <div className="space-y-3">
            {phases.map((phase, i) => (
              <div key={i} className="rounded-lg bg-[var(--bg-primary)] p-4 border border-[var(--border)]">
                <p className="font-medium">{phase.name}</p>
                {phase.tasks && (
                  <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
                    {phase.tasks.map((t, j) => <li key={j}>• {t}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {milestones?.length > 0 && (
        <div>
          <h4 className="font-semibold text-violet-400 mb-3">Milestones</h4>
          <ul className="space-y-1 text-sm">{milestones.map((m, i) => <li key={i}>🏁 {m}</li>)}</ul>
        </div>
      )}

      {nextSteps?.length > 0 && (
        <div>
          <h4 className="font-semibold text-violet-400 mb-3">Next Steps</h4>
          <ul className="space-y-1 text-sm">{nextSteps.map((s, i) => <li key={i}>→ {s}</li>)}</ul>
        </div>
      )}

      {result.summary && !meeting && !tasks && !email && (
        <pre className="text-sm whitespace-pre-wrap text-[var(--text-muted)]">{result.summary}</pre>
      )}
    </div>
  );
}

export default WorkflowOutput;
