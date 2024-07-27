'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '../lib/auth';
import Head from 'next/head';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
      } else {
        const isValid = await validateToken(token);
        if (!isValid) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
        }
        
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Logging You In...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white">
      <Head>
        <title>Blueberry AI</title>
        <meta name="description" content="Welcome to Blueberry AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-black">
          Welcome to{' '}
          <span className="text-blue-900">Blueberry AI</span>
        </h1>
      </main>
    </div>
  );
}
