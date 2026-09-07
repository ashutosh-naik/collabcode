'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/schemas/auth.schema';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response) {
    const data = err.response.data;
    if (Array.isArray(data?.message)) {
      return data.message[0];
    }
    if (typeof data?.message === 'string') {
      return data.message;
    }
  }
  return 'Something went wrong. Please check your connection and try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const expired = searchParams.get('expired') === '1';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.accessToken, response.data.user);
      router.push('/dashboard');
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold text-white">Sign in to CollabCode</h1>

        {expired && (
          <div className="mb-4 rounded-md border border-yellow-900 bg-yellow-950/50 px-3 py-2">
            <p className="text-sm text-yellow-400">
              Your session expired. Please sign in again.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Email</label>
            <input
              {...register('email')}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-500"
              type="email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Password</label>
            <input
              {...register('password')}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-500"
              type="password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2">
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
