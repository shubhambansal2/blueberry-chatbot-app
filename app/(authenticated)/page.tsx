// app/(authenticated)/page.tsx
'use client'

import Testchatbotpage from './testchatbot/page';
import { StrictMode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Templates from '../../components/TemplateCardShowcase';

export default function Home() {
  return (
    <StrictMode>
  <div className="flex flex-col gap-10">
  <Card className="bg-quinary shadow-lg ml-8 mt-10">
    <CardContent className="p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome to Blueberry AI 👋</h1>
      <p className="text-gray-600">
        Welcome to Blueberry AI, start building your chatbot with powerful technology. Get ready to revolutionize your customer interactions!
      </p>
      <button className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
        Learn How to Build and Deploy Chatbots in Minutes
      </button>
    </CardContent>
  </Card>
  <div className="flex-grow">
    <Testchatbotpage />
  </div>

  {/* <div className="flex flex-col">
    <p className="text-2xl font-bold ml-8">Quick Start with Templates</p>
    <Templates />
  </div> */}
</div>
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