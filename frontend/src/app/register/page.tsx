'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/schemas/auth.schema';
import { api } from '@/lib/api';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await api.post('/auth/register', data);
      router.push('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setServerError(err.response.data.message || 'Registration failed');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold text-white">Create your account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Name</label>
            <input
              {...register('name')}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-500"
              type="text"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Username</label>
            <input
              {...register('username')}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-blue-500"
              type="text"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

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
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
