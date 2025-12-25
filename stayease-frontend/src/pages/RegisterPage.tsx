import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRound, Building2, Eye, EyeOff } from 'lucide-react';
import { registerOwner, registerUser } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'react-hot-toast';

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(40),
    confirmPassword: z.string().min(6).max(40),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
    role: z.enum(['USER', 'OWNER']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultRole = (params.get('role') as 'USER' | 'OWNER') || 'USER';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', role: defaultRole },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (values.role === 'OWNER') {
        const res = await registerOwner(values);
        return { res, role: values.role };
      }
      const res = await registerUser(values);
      return { res, role: values.role };
    },
    onSuccess: (payload) => {
      toast.success(`${payload.role} account created. Please login.`);
      navigate('/login');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Join StayEase</p>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {form.watch('role') === 'OWNER' ? <Building2 className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
          {form.watch('role')}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1">
        <button
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            form.watch('role') === 'USER' ? 'bg-white shadow-sm' : 'text-slate-600'
          }`}
          onClick={() => {
            form.setValue('role', 'USER');
            params.set('role', 'USER');
            setParams(params);
          }}
          type="button"
        >
          General User
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            form.watch('role') === 'OWNER' ? 'bg-white shadow-sm' : 'text-slate-600'
          }`}
          onClick={() => {
            form.setValue('role', 'OWNER');
            params.set('role', 'OWNER');
            setParams(params);
          }}
          type="button"
        >
          PG Owner
        </button>
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <Input type="email" placeholder="you@example.com" {...form.register('email')} />
          {form.formState.errors.email && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <div className="relative">
            <Input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" {...form.register('password')} />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded p-1 text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Re-enter password</label>
          <div className="relative">
            <Input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" {...form.register('confirmPassword')} />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded p-1 text-slate-500 hover:text-slate-700"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Phone</label>
          <Input placeholder="10-digit phone" {...form.register('phone')} />
          {form.formState.errors.phone && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.phone.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">First name</label>
          <Input placeholder="First name" {...form.register('firstName')} />
          {form.formState.errors.firstName && (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Last name</label>
          <Input placeholder="Last name" {...form.register('lastName')} />
          {form.formState.errors.lastName && (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.lastName.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-(--color-primary)">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
