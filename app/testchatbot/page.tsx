'use client'
import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import ChatbotWindow from '../../components/chatbot';
import { fetchChatbots, Chatbot } from '../../lib/chatbotsfetch';


const Testchatbotpage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);

 const handleChatbotClick = (chatbot: any) => {
    setSelectedChatbot(chatbot);
    console.log(chatbot);
  };
  const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);

  useEffect(() => {
    const getChatbots = async () => {
      try {
        const chatbots = await fetchChatbots();
        setSavedChatbots(chatbots);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
      }
    };
    getChatbots();
  }, []);
  

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Handle cancel logic here
  };

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

      {/* Main Content */}
  <div className="flex-1 p-8 ml-0 md:ml-64 overflow-auto">

<div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Chatbots</h2>
          <div className="flex flex-wrap -mx-4">
        {savedChatbots.map((bot) => (
          <div key={bot.chatbot_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
            <button
              className="w-full bg-white rounded-lg shadow-md overflow-hidden focus:outline-none"
              onClick={() => handleChatbotClick(bot)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{bot.chatbot_name}</h3>
                <p className="text-gray-600">Company: {bot.company_name}</p>
                <p className="text-gray-600">Role: {bot.role}</p>
                <p className="text-gray-600">Personality: {bot.personality}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>  
      {/* <div className="flex flex-wrap -mx-4">
        {savedChatbots.map((bot) => (
          <button
            key={bot.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8 focus:outline-none"
            onClick={() => handleChatbotClick(bot)}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{bot.name}</h3>
                <p className="text-gray-600">Company: {bot.company}</p>
              </div>
            </div>
          </button>
        ))}
      </div> */}
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