import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, Link, useNavigate } from '@tanstack/react-router';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';
import { CreditCard, ShieldCheck, Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

// ─── Layout ───────────────────────────────────────────────────────────────────

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shadow-green-glow group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-foreground">PaySecure</span>
            <span className="hidden sm:block text-xs text-muted-foreground -mt-0.5">Secure Payment Gateway</span>
          </div>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all [&.active]:text-emerald-700 [&.active]:bg-emerald-50"
          >
            Payment
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all [&.active]:text-emerald-700 [&.active]:bg-emerald-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown-app';
  const appId = encodeURIComponent(hostname);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="w-4 h-4 text-emerald-500" />
          <span>© {year} PaySecure. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          <span>using</span>
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PaymentPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
