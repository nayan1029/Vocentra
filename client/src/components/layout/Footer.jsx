import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <span>🎙️</span>
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Vocentra
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm max-w-md">
              Turn your voice into intelligent actions. AI-powered workflow automation
              that transforms spoken language into structured, actionable plans.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="#features" className="hover:text-[var(--text-primary)]">Features</a></li>
              <li><a href="#demo" className="hover:text-[var(--text-primary)]">Demo</a></li>
              <li><Link to="/dashboard" className="hover:text-[var(--text-primary)]">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><Link to="/login" className="hover:text-[var(--text-primary)]">Login</Link></li>
              <li><Link to="/register" className="hover:text-[var(--text-primary)]">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Vocentra. Built by Nayan Kumar Shukla.</p>
          <p>MIT License</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
