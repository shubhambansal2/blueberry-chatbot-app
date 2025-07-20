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
  <Card className="bg-quinary shadow-lg mx-4 md:mx-8 mt-6 md:mt-10">
    <CardContent className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Purpleberry AI 👋</h1>
      <p className="text-sm md:text-base text-gray-600">
        Welcome to Purpleberry AI, start building your agents with powerful technology. Get ready to revolutionize your customer interactions!
      </p>
      {/* <button 
        className="mt-4 w-full md:w-auto bg-black text-white px-4 md:px-6 py-2 rounded-md hover:bg-gray-800 text-sm md:text-base"
        onClick={() => window.open('https://www.loom.com/share/5bb5650434b0405c91ab7b244ceeb757?sid=17b0cec0-8f19-400d-a3ae-c06ec6b321d3', '_blank')}
      >
        Learn How to Build and Deploy Chatbots in Minutes
      </button> */}
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