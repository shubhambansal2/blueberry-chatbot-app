'use client'
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { validateToken } from '../../lib/auth';
import GlobalLoadingOverlay from '../../components/GlobalLoadingOverlay';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Only show loading on initial mount
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async (showLoading = false) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setIsAuthenticated(false);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      const isValid = await validateToken(token);
      if (!isValid) {
        setIsAuthenticated(false);
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setIsAuthenticated(false);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } finally {
      if (showLoading) {
        setIsInitializing(false);
      }
    }
  }, [router, pathname]);

  // Handle client-side mounting and initial auth check
  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated) {
      checkAuth(true); // Only show loading on initial check
    }
  }, []);

  // Set up interval for periodic token validation
  useEffect(() => {
    if (!isClient) return;

    // Check auth every 5 minutes without showing loading state
    const interval = setInterval(() => {
      checkAuth(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isClient, checkAuth]);

  // Add event listener for focus to revalidate when tab becomes active
  useEffect(() => {
    if (!isClient) return;

    const handleFocus = () => {
      checkAuth(false); // Don't show loading on focus checks
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isClient, checkAuth]);

  // Show loading state only during initial client mount
  if (!isClient || isInitializing) {
    return <GlobalLoadingOverlay />;
  }

  // Show children if authenticated, redirect handled in checkAuth
  return isAuthenticated ? <>{children}</> : null;
}