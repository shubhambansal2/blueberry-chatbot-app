'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from '../lib/auth';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Make sure to install react-icons

import {SidebarHome} from '../components/home_sidebar'
import Head from 'next/head';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-100 text-gray-800 p-6 transition duration-200 ease-in-out z-10 flex flex-col justify-between shadow-lg`}>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Menu</h2>
          <ul className="space-y-4">
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">
            <Link href="/createchatbot">Create Chatbots</Link></li>
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">
            <Link href="/testchatbot">Test Chatbots</Link></li>
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">
            <Link href="/chatbotmessages">Conversations</Link></li>
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">Integrations</li>
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">Resources</li>
          </ul>
        </div>
        <div className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">
          Profile
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-gray-200/[0.2] pointer-events-none"></div>
        
        {/* Main Content Text */}
        <h1 className="text-5xl font-bold text-gray-800 text-center z-10 px-4">
          Create your custom chatbots<br />and deploy them on the go !
        </h1>
      </div>
    </div>
      );

};