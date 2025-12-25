import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { login as loginApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/auth/AuthProvider';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/';

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      login(res);
      toast.success('Welcome back!');
      navigate(redirectTo, { replace: true });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-50 p-3 text-(--color-primary)">
          <LogIn className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Access</p>
          <h1 className="text-2xl font-bold text-slate-900">Login to StayEase</h1>
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <Input type="email" placeholder="you@example.com" {...form.register('email')} />
          {form.formState.errors.email && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <Input type="password" placeholder="••••••••" {...form.register('password')} />
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        New here?{' '}
        <Link to="/register" className="font-semibold text-(--color-primary)">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Demo accounts: owner@test.com / password123 · user@test.com / password123
      </p>
    </div>
  );
};

export default LoginPage;
