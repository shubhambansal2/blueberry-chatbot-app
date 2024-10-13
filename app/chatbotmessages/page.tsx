'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation'; // For accessing dynamic route parameters
import { MessageCircle, User } from 'lucide-react';
import axios from 'axios';
import { Chatbot, fetchChatbots } from '@/lib/chatbotsfetch';
import { FiX, FiMenu } from 'react-icons/fi';
import { AppWrapperHOC } from '@/Root/HOC';
interface Message {
  id: number;
  sender: string;
  content: string;
  chatbot: string;
}

interface Consumer {
  id: string;
  name: string;
}

const Sidebar = ({
  chatbots,
  consumers,
  selectedChatbot,
  selectedConsumer,
  onSelectChatbot,
  onSelectConsumer,
  sidebarOpen,
  setSidebarOpen
}: {
  chatbots: Chatbot[],
  consumers: Consumer[],
  selectedChatbot: Chatbot | null,
  selectedConsumer: string | null,
  onSelectChatbot: (chatbot: Chatbot) => void,
  onSelectConsumer: (consumerId: string) => void,
  sidebarOpen: boolean,
  setSidebarOpen: (open: boolean) => void
}) => (
  <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-gray-100 p-4 transition duration-200 ease-in-out z-30 md:relative md:translate-x-0`}>
    <button
      className="md:hidden absolute top-4 right-4"
      onClick={() => setSidebarOpen(false)}
    >
      <FiX className="h-6 w-6" />
    </button>
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Chatbot</h3>
    {chatbots.map(chatbot => (
      <button
        key={chatbot.chatbot_id}
        className={`mb-2 p-2 rounded w-full text-left ${selectedChatbot?.chatbot_id === chatbot.chatbot_id ? 'bg-blue-800 text-white text-bold' : 'bg-gray-700 text-white'}`}
        onClick={() => onSelectChatbot(chatbot)}
      >
        {chatbot.chatbot_name}
      </button>
    ))}
    <h3 className="text-lg font-semibold mt-6 mb-4 text-gray-800">Select Consumer</h3>
    {consumers.map(consumer => (
      <button
        key={consumer.id}
        className={`mb-2 p-2 rounded w-full text-left ${selectedConsumer === consumer.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
        onClick={() => onSelectConsumer(consumer.id)}
      >
        {consumer.name}
      </button>
    ))}
  </div>
);

const ChatbotMessagesPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [selectedConsumer, setSelectedConsumer] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user');
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    getChatbots();
    fetchConsumers();
  }, []);

  useEffect(() => {
    if (userId && selectedChatbot && selectedConsumer) {
      fetchMessages(selectedConsumer, selectedChatbot.chatbot_id.toString());
    }
  }, [selectedConsumer, selectedChatbot, userId]);

  const getChatbots = async () => {
    try {
      const chatbots = await fetchChatbots();
      setSavedChatbots(chatbots);
      if (chatbots.length > 0) {
        setSelectedChatbot(chatbots[0]);
      }
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  };

  const fetchConsumers = async () => {
    try {
      // Temporarily setting default consumers data
      const defaultConsumers = [{ id: '1', name: 'Default Consumer' }];

      // Uncomment the below lines when backend API is ready
      // const response = await axios.get('http://localhost:8000/api/consumers/');
      // setConsumers(response.data);
      // if (response.data.length > 0) {
      //   setSelectedConsumer(response.data[0].id);
      // }

      // For now, set default consumer
      setConsumers(defaultConsumers);
      setSelectedConsumer('1');  // Setting default consumerId as '1'
    } catch (error) {
      console.error('Error fetching consumers:', error);
    }
  };

  const fetchMessages = async (consumerId: string, chatbotId: string) => {
    try {
      const response = await axios.get(
        `https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbot/${chatbotId}/${userId}/1/get_messages_from_db/`
      );

      const fetchedMessages: Message[] = response.data.messages.map(
        (msg: any, index: number) => ({
          id: index + 1,
          sender: msg.is_from_user ? 'User' : 'Chatbot',
          content: msg.content,
          chatbot: `Chatbot${chatbotId}`,
        })
      );

      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChatbotClick = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    console.log(chatbot);
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-100">
      {/* Toggle button for small screens */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white shadow-xl transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:shadow-none font-sans text-sm leading-relaxed`}
      >
        <Sidebar
          chatbots={savedChatbots}
          consumers={consumers}
          selectedChatbot={selectedChatbot}
          selectedConsumer={selectedConsumer}
          onSelectChatbot={handleChatbotClick}
          onSelectConsumer={setSelectedConsumer}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h2 className="text-2xl font-bold p-4 text-gray-800">
          Chat with {selectedChatbot?.chatbot_name || 'Chatbot'}
        </h2>
        <div className="flex-grow overflow-y-auto p-4 bg-white border border-gray-200">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${message.sender === 'User' ? 'justify-start' : 'justify-end'
                }`}
            >
              {message.sender === 'User' && (
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'User'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                  }`}
              >
                <p className="text-sm font-medium mb-1">{message.sender}</p>
                <p className="text-sm">{message.content}</p>
              </div>
              {message.sender !== 'User' && (
                <div className="flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatbotMessagesPage;