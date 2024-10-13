'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '../lib/auth';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Make sure to install react-icons

import {SidebarHome} from '../components/home_sidebar'
import Head from 'next/head';
import { AppWrapperHOC } from '@/Root/HOC';
import Dashboard from '@/components/Dashboard/dashboard';

const Home = () => {
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
    <Dashboard/>
      );

};

export default AppWrapperHOC(Home);