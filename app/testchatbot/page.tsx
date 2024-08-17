'use client'
import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import ChatbotWindow from '../../components/chatbot';
import { fetchChatbots, Chatbot } from '../../lib/chatbotsfetch';
import axios from 'axios';


const Testchatbotpage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  


 const handleChatbotClick = (chatbot: any) => {
    setSelectedChatbot(chatbot);
    console.log(chatbot);
  };
  const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);

  const getChatbots = async () => {
    try {
      const chatbots = await fetchChatbots();
      setSavedChatbots(chatbots);
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  };

  useEffect(() => {
    getChatbots();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
  };


  function handleDeleteChatbot(chatbot_id: number): void {
    console.log('Deleting chatbot with ID:', chatbot_id);
    const token = localStorage.getItem('accessToken');
    axios.delete(
      `https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/deletechatbot/${chatbot_id}/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log('Chatbot deleted:', response.data);
        getChatbots();
      })
      .catch((error) => {
        console.error('Error deleting chatbot:', error);
      });
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
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">Integrations</li>
            <li className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">Resources</li>
          </ul>
        </div>
        <div className="hover:bg-gray-200 p-2 rounded cursor-pointer transition duration-150">
          Profile
        </div>
      </div>
  
  <div className="flex-1 p-8 ml-0 md:ml-64 overflow-auto">
  
    <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Chatbots</h2>
          <div className="flex flex-wrap -mx-4">
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
                const handleEditBot = (bot: any) => {
                  console.log('Editing chatbot:', bot);
                };
                handleEditBot(bot.chatbot_id);
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
</div>
    </div>  
  </div>
    {selectedChatbot && (
        <ChatbotWindow
          chatbot={selectedChatbot}
          onClose={() => setSelectedChatbot(null)}
        />
      )}
    </div>
  );
};

export default Testchatbotpage;