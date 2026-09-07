'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/schemas/auth.schema';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

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
      if (axios.isAxiosError(err) && err.response) {
        setServerError(err.response.data.message || 'Login failed');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold text-white">Sign in to CollabCode</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Email</label>
            <input
              {...register('email')}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-500"
              type="email"
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
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-400">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
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
