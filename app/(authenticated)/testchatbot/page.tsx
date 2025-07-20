'use client'
import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import ChatbotWindow from '../../../components/chatbot';
import { fetchChatbots, Chatbot } from '../../../lib/chatbotsfetch';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import GradientButton from '../../../components/ui/GradientChatbotButton';
import GradientCard from '../../../components/GradientChatbotCard';
import DeleteDialogue from '../../../components/DeleteDialogue';
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay';
import ChatWidget from '../../../components/Chatbot_New2';
import LoadingSkeletons from '../../../components/LoadingSkeletons';
import ChatbotLoadingSkeleton from '../../../components/LoadingSkeletons';
import TemplateCardShowcase from '../../../components/TemplateCardShowcase';



const ChatOverlay = ({ selectedChatbot, onClose }: { selectedChatbot: Chatbot | null, onClose: () => void }) => {
  if (!selectedChatbot) return null;
  const customerData = {
    consumerName: 'Your Test Messages',
    consumerId: '3',
    isLoggedIn: true
  };
    
  
  // const consumerName = localStorage.getItem('consumerName');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-lg w-full  h-full flex flex-col relative">
          <ChatWidget
            chatbotId={selectedChatbot.chatbot_id.toString()}
            chatbotName={selectedChatbot.chatbot_name}
            apiKey="ABC"
            accentColor="#FF0000"
            customerData={customerData}
          />
        <div className="absolute top-4 right-4 flex gap-2">
          {/* <button
            onClick={() => window.location.href = '/deploychatbot'}
            className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Deploy
          </button> */}
          <button
  onClick={onClose}
  className="group relative bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 py-2.5 px-6 rounded-lg font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95"
>
  <span className="flex items-center gap-2">
    <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
    Stop Testing
  </span>
</button>
        </div>
      </div>
    </div>
  );
};

const Testchatbotpage = () => {
  // const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(true);

  
  const handleClose = () => {
    setSelectedChatbot(null);
  };
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  

  const handleChatbotClick = (chatbot: any) => {
    setSelectedChatbot(chatbot);
    console.log(chatbot);
  };

  const getChatbots = async () => {
    try {
      const chatbots = await fetchChatbots();
      setSavedChatbots(chatbots);
      setIsLoadingChatbots(false);
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  };

  useEffect(() => {
    getChatbots();
  }, []);

  const router = useRouter();

  const handleEditChatbot = (chatbot_id: number) => {
    console.log('Editing chatbot with ID:', chatbot_id);
    router.push(`/editchatbot/${chatbot_id}`);
  };
  const handleDeleteChatbot = async (chatbot_id: number): Promise<void> => {

    const confirmDelete = window.confirm('Are you sure you want to delete this chatbot? This action cannot be undone.');
    
    if (!confirmDelete) {
      return;
    }
    setIsDeleting(true);
    
    
    console.log('Deleting chatbot with ID:', chatbot_id);
    const token = localStorage.getItem('accessToken');
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/deletechatbot/${chatbot_id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Chatbot deleted:', response.data);
      await getChatbots();
    } catch (error) {
      console.error('Error deleting chatbot:', error);
    } finally {
      setIsDeleting(false);
    }
      setIsDeleting(false);
      console.log('Chatbot deleted');
  };

  return (
      <div className="flex flex-col p-8 overflow-auto">
        
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Agents</h2>
          <div className="flex flex-row items-center space-x-6 overflow-x-auto pb-4 mt-8">
          {!isLoadingChatbots && <div className="hidden lg:block"><GradientButton /></div>}
            <div className="flex flex-wrap gap-8">
            {isLoadingChatbots ? (
              // Show loading skeletons while loading
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex-shrink-0">
                  <ChatbotLoadingSkeleton />
                </div>
              ))
            ) : (
              // Show actual chatbots once loaded
              savedChatbots.map((bot, index) => {
                const colorSchemes = ['maroon', 'ocean', 'forest', 'plum', 'slate', 'sunset'];
                const colorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <div key={bot.chatbot_id} className="flex-shrink-0">
                    <GradientCard
                      chatbotName={bot.chatbot_name}
                      companyName={bot.company_name}
                      colorScheme={colorScheme as 'maroon' | 'ocean' | 'forest' | 'plum' | 'slate' | 'sunset'}
                      onEdit={() => handleEditChatbot(bot.chatbot_id)}
                      onDelete={() => handleDeleteChatbot(bot.chatbot_id)}
                      onClick={() => handleChatbotClick(bot)}
                    />
                  </div>
                );
              })
            )}
            </div>
          </div>
        {selectedChatbot && <ChatOverlay selectedChatbot={selectedChatbot} onClose={handleClose} />}
        {isDeleting && <GlobalLoadingOverlay message="Deleting chatbot..." />}
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mt-20">Start with Templates</h2>
        <TemplateCardShowcase />
        </div>
      </div>
      
  );
};

export default Testchatbotpage;

 {/* <div className="flex flex-wrap -mx-4 mt-8">
            {savedChatbots.map((bot) => (
              <React.Fragment key={bot.chatbot_id}>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
                  <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      className="w-full focus:outline-none"
                      onClick={() => handleChatbotClick(bot)}
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{bot.chatbot_name}</h3>
                        <p className="text-gray-600">Company: {bot.company_name}</p>
                        <p className="text-gray-600">Role: {bot.role}</p>
                        <p className="text-gray-600">Personality: {bot.personality}</p>
                      </div>
                    </button>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        className="p-1 text-gray-500 hover:text-blue-700 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Define the handleEditBot function here
                          // const handleEditBot = (bot: any) => {
                          //   console.log('Editing chatbot:', bot);
                          //   handleEditBot(bot.chatbot_id);
                          // };
                          handleEditChatbot(bot.chatbot_id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-600 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChatbot(bot.chatbot_id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div> */}