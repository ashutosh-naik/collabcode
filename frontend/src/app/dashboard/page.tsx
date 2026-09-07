'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { api } from '@/lib/api';

interface MeResponse {
  id: string;
  email: string;
  username: string;
  name: string;
}

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      api
        .get<MeResponse>('/users/me')
        .then((res) => setMe(res.data))
        .catch(() => {
          // interceptor handles redirect on 401; nothing else to do here
        })
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (isLoading || !user || fetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <button
            onClick={logout}
            className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
          >
            Log out
          </button>
        </div>

        <div className="rounded-md border border-gray-800 bg-gray-900 p-4">
          <p className="text-white">Welcome, {me?.name ?? user.name}!</p>
          <p className="mt-1 text-sm text-gray-400">
            @{me?.username ?? user.username} - {me?.email ?? user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
