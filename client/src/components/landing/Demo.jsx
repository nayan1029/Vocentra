function Demo() {
  return (
    <section className="py-24 bg-[var(--bg-primary)] text-[var(--text-primary)]">

      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          AI Demo
        </h2>

        <div className="bg-[var(--bg-secondary)] rounded-3xl p-10 mt-12 border border-[var(--border)]">

          <p className="text-xl">
            🎤 Schedule a meeting tomorrow at 4 PM and remind everyone on Slack.
          </p>

          <div className="bg-[var(--bg-primary)] rounded-xl p-6 mt-8 border border-[var(--border)]">

            <h3 className="text-violet-400 font-semibold">
              AI Output
            </h3>

            <ul className="mt-5 space-y-3">

              <li>✅ Create Calendar Event</li>

              <li>✅ Notify Slack Team</li>

              <li>✅ Send Reminder</li>

            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Demo;