import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3 text-orange-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Access denied</p>
            <h1 className="text-2xl font-semibold text-slate-900">You don&apos;t have permission</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          This area is restricted. If you believe this is a mistake, try switching accounts or contact the property
          owner.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/">
            <Button variant="ghost">Back home</Button>
          </Link>
          <Link to="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
