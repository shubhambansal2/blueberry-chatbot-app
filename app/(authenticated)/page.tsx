// app/(authenticated)/page.tsx
'use client'

import Testchatbotpage from './testchatbot/page';
import { StrictMode } from 'react';


export default function Home() {
  return (
    <StrictMode>
      <Testchatbotpage />
    </StrictMode>
  );
}


  // const [isAuthenticated, setIsAuthenticated] = useState(() => {
  //   // Initialize auth state based on token existence
  //   return !!localStorage.getItem('accessToken');
  // });
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('accessToken');
  //     if (!token) {
  //       setIsAuthenticated(false);
  //       router.push('/login');
  //       return;
  //     }
      
  //     try {
  //       const isValid = await validateToken(token);
  //       if (!isValid) {
  //         setIsAuthenticated(false);
  //         router.push('/login');
  //         return;
  //       }
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       console.error('Auth validation error:', error);
  //       setIsAuthenticated(false);
  //       router.push('/login');
  //     }
  //   };

  //   // Only run validation if there's a token
  //   if (localStorage.getItem('accessToken')) {
  //     checkAuth();
  //   } else {
  //     router.push('/login');
  //   }
  // }, [router]);

  // // If not authenticated, return null (page will redirect)
  // if (!isAuthenticated) {
  //   return null;
  // }