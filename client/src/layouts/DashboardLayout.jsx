import Navbar from "../components/layout/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}

export default DashboardLayout;
