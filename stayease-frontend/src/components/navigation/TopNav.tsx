import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '@/auth/AuthProvider';
import { cn } from '@/utils/cn';

export const TopNav = () => {
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/search', label: 'Explore' },
    { href: '/properties', label: 'Listings' },
    { href: '/about', label: 'About' },
  ];

  const userLinks = [
    { href: '/my-bookings', label: 'My Bookings' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-200/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-primary) text-white font-semibold">
            SE
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">StayEase</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Manage stays smarter</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium text-slate-600 hover:text-slate-900',
                location.pathname.startsWith(link.href) && 'text-slate-900',
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !isOwner && userLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium text-slate-600 hover:text-slate-900',
                location.pathname === link.href && 'text-slate-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {isOwner && (
                <Link to="/owner">
                  <Button variant="outline" size="sm">
                    Owner Console
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                <UserRound className="h-4 w-4" />
                {user?.firstName}
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-slate-700 hover:text-slate-900">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </div>
        <button
          className="inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            {isAuthenticated && !isOwner && userLinks.map((link) => (
              <Link key={link.href} to={link.href} className="text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {isOwner && (
                  <Link to="/owner" className="text-sm font-semibold text-(--color-primary)">
                    Owner Console
                  </Link>
                )}
                <button className="text-left text-sm font-medium text-slate-700" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-700">
                  Sign in
                </Link>
                <Link to="/register" className="text-sm font-medium text-slate-700">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
