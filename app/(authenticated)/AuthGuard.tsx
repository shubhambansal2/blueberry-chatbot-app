'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '../../lib/auth';
import GlobalLoadingOverlay from '../../components/GlobalLoadingOverlay';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  // Add a mounting state
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with false always
  const router = useRouter();

  // First, handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Then handle authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        router.push('/login');
        return;
      }

      try {
        const isValid = await validateToken(token);
        if (!isValid) {
          setIsAuthenticated(false);
          router.push('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    if (isClient) {
      checkAuth();
    }
  }, [router, isClient]);

  // Show loading state during initial server render and client mounting
  if (!isClient) {
    return <GlobalLoadingOverlay />;  // Or any loading component
  }

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return <GlobalLoadingOverlay />;  // Or any loading component
  }

  // Only render children when authenticated
  return <>{children}</>;
}