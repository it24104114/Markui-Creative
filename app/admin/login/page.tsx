'use client';

export const dynamic = 'force-dynamic';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
      });

      if (!result || result.error || !result.ok) {
        setError('Invalid email or password.');
        return;
      }

      // Use NextAuth's resolved callback URL so host and basePath are respected.
      window.location.href = result.url ?? '/admin/dashboard';
    } catch {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-display font-bold text-white">
            Mark<span className="text-primary">UI</span> Admin
          </h1>
          <p className="text-sm text-text-muted mt-1">Sign in to your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
          <div>
            <label className="form-label">Email</label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="admin@markui.lk"
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              {...register('password')}
              type="password"
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
              <Lock size={13} />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-text-subtle">
          <a href="/" className="hover:text-primary transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
