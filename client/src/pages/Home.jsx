import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import Demo from "../components/landing/Demo";
import heroImage from "../assets/hero.png";

const features = [
  { icon: "🎤", title: "Voice-to-Text", desc: "Record commands from your browser or upload audio for processing." },
  { icon: "🧠", title: "AI Understanding", desc: "Extract intent from natural language and convert to structured workflows." },
  { icon: "📋", title: "Workflow Generation", desc: "Meeting summaries, action items, task planning, and daily planners." },
  { icon: "📚", title: "History Dashboard", desc: "Access, search, and organize all your previously generated workflows." },
  { icon: "👤", title: "Secure Auth", desc: "JWT-based authentication with a protected personal dashboard." },
  { icon: "📊", title: "Analytics", desc: "Track usage statistics and productivity insights over time." },
];

const steps = [
  { num: "01", title: "Speak", desc: "Record your voice or type a natural language command." },
  { num: "02", title: "Process", desc: "AI extracts intent and structures your request." },
  { num: "03", title: "Execute", desc: "Get actionable workflows, tasks, and plans instantly." },
];

function Home() {
  return (
    <MainLayout>
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-6">
              AI-Powered Workflow Automation
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Turn Your Voice Into{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Intelligent Actions
              </span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-muted)] max-w-lg">
              Speak naturally, let AI understand your intent, and receive intelligent
              action plans — from meeting notes to daily planners in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
              >
                Start Free
              </Link>
              <a
                href="#demo"
                className="px-8 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] font-medium transition-colors"
              >
                See Demo
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl shadow-violet-500/10">
              <img src={heroImage} alt="Vocentra dashboard preview" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Everything You Need</h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-2xl mx-auto">
              From voice input to actionable workflows — Vocentra handles the entire pipeline.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 hover:border-violet-500/50 transition-colors"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="text-xl font-semibold mt-4">{f.title}</h3>
                <p className="mt-2 text-[var(--text-muted)] text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-[var(--text-muted)]">Three simple steps from voice to execution</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-5xl font-bold text-violet-500/30">{s.num}</div>
                <h3 className="text-xl font-semibold mt-4">{s.title}</h3>
                <p className="mt-2 text-[var(--text-muted)] text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="demo">
        <Demo />
      </div>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold">Ready to transform your workflow?</h2>
          <p className="mt-4 text-[var(--text-muted)]">
            Join Vocentra and move from voice to execution in seconds.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;
