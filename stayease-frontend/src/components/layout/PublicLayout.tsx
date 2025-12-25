import { Outlet } from 'react-router-dom';
import { TopNav } from '../navigation/TopNav';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-slate-600">
          <span>© {new Date().getFullYear()} StayEase. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="mailto:hello@stayease.com" className="hover:text-slate-900">
              Support
            </a>
            <a href="https://stayease.example" className="hover:text-slate-900">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
