import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function NotFound() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-8xl font-bold text-violet-500/30">404</p>
        <h1 className="text-3xl font-bold mt-4">Page not found</h1>
        <p className="mt-2 text-[var(--text-muted)]">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          to="/"
          className="mt-8 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          Go Home
        </Link>
      </div>
    </MainLayout>
  );
}

export default NotFound;
