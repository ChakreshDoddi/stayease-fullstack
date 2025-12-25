import { LayoutDashboard, Home, BedDouble, BookOpenText, Inbox, LogOut } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/owner', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/owner/properties', label: 'Properties', icon: Home },
  { to: '/owner/rooms', label: 'Rooms & Beds', icon: BedDouble },
  { to: '/owner/bookings', label: 'Bookings', icon: BookOpenText },
  { to: '/owner/inquiries', label: 'Inquiries', icon: Inbox },
];

export const OwnerLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 hidden w-64 border-r border-slate-200 bg-white/90 px-4 py-6 md:block">
        <Link to="/" className="flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-primary) text-white font-semibold">
            SE
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">StayEase</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Owner</p>
          </div>
        </Link>
        <div className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100',
                  isActive && 'bg-slate-900 text-white shadow-md shadow-slate-300/40',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          <span>{user?.firstName}</span>
          <button onClick={logout} className="inline-flex items-center gap-2 text-slate-700">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Owner Console</p>
              <p className="text-lg font-semibold text-slate-900">Welcome back, {user?.firstName}</p>
            </div>
            <Link to="/" className="text-sm font-semibold text-(--color-primary) hover:underline">
              View public site
            </Link>
          </div>
        </header>
        <main className="px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
