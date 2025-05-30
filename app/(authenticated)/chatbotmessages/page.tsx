'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation'; // For accessing dynamic route parameters
import { Menu, MessageCircle, User, X } from 'lucide-react';
import axios from 'axios';
import { Chatbot, fetchChatbots } from '../../../lib/chatbotsfetch';
import { Button } from "../../../components/ui/Button";
import { Bot, Users } from 'lucide-react';
import ChatSkeleton from '../../../components/Chatskeleton';

const ChatbotListSkeleton: React.FC = () => {
  // Simulate an array to match the expected chatbots list
  const skeletonChatbots = Array(2).fill(null);

  return (
    <div className="space-y-1">
      {skeletonChatbots.map((_, index) => (
        <div
          key={index}
          className="w-full px-2 py-1.5 text-sm text-left rounded-md bg-gray-300 animate-pulse"
          style={{ height: "40px" }} // Approximate height of the button
        />
      ))}
    </div>
  );
};

interface Message {
    id: number;
    sender: string;
    content: string;
    chatbot: string;
    message_time: string;
  }
  
  interface Consumer {
    id: string;
    name: string;
  }
  
  // Define a type for the Sidebar props
  interface SidebarProps {
    chatbots: Chatbot[];
    consumers: Consumer[];
    selectedChatbot: Chatbot | null;
    selectedConsumer: string | null;
    onSelectChatbot: (chatbot: Chatbot) => void;
    onSelectConsumer: (consumerId: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    isLoading: boolean;
  }
  
  const Sidebar = ({ 
    chatbots, 
    consumers, 
    selectedChatbot, 
    selectedConsumer, 
    onSelectChatbot, 
    onSelectConsumer,
    sidebarOpen,
    setSidebarOpen,
    isLoading
  }: SidebarProps) => {
    return (
      <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black hidden md:block">Conversations</h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 space-y-8 py-2">
        {/* Chatbots Section */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-2">
            <Bot className="h-4 w-4 text-black" />
            <h3 className="text-sm font-medium text-black">Chatbots</h3>
          </div>
          <div className="space-y-1">
            {isLoading ? <ChatbotListSkeleton /> : chatbots.map(chatbot => (
              <button
                key={chatbot.chatbot_id}
                onClick={() => onSelectChatbot(chatbot)}
                className={`w-full px-2 py-1.5 text-sm text-left rounded-md transition-colors 
                  ${selectedChatbot?.chatbot_id === chatbot.chatbot_id 
                    ? 'bg-primary font-medium text-gray-100' 
                    : 'text-black font-medium hover:bg-gray-800 hover:text-white'}`}
              >
                {chatbot.chatbot_name}
              </button>
            ))}
          </div>
        </div>

        {/* Consumers Section */}
        <div>
          <div className="flex items-center gap-2 px-2 mb-2">
            <Users className="h-4 w-4 text-black" />
            <h3 className="text-sm font-medium text-black">Consumers</h3>
          </div>
          <div className="space-y-1">
            {consumers.map(consumer => (
              <button
                key={consumer.id}
                onClick={() => onSelectConsumer(consumer.id)}
                className={`w-full px-2 py-1.5 text-sm text-left rounded-md transition-colors 
                  ${selectedConsumer === consumer.id 
                    ? 'bg-primary font-medium text-gray-100' 
                    : 'text-black font-medium hover:bg-gray-800 hover:text-white'}`}
              >
                {consumer.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
  
const ChatbotMessagesPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State declarations
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [selectedConsumer, setSelectedConsumer] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  // Utility functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // API calls
  const getChatbots = async () => {
    try {
      const chatbots = await fetchChatbots();
      setSavedChatbots(chatbots);
      setIsLoading(false);
      if (chatbots.length > 0) {
        setSelectedChatbot(chatbots[0]);
      }
    } catch (error) {
      console.error('Error fetching chatbots:', error);
      setIsLoading(false);
    }
  };

  const fetchConsumers = async (chatbotId: string) => {
    try {
      console.log("fetching consumers with chatbotId:", chatbotId);
      
      if (!chatbotId || chatbotId === 'undefined' || chatbotId === 'null') {
        console.error('Invalid chatbotId:', chatbotId);
        return;
      }

      const userId = localStorage.getItem('user');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
      console.log("userId:", userId);

      const response = await axios.get(
        `https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_all_consumers/${chatbotId}/${userId}/`
      );
      
      console.log("API Response:", response.data);
      const formattedConsumers: Consumer[] = response.data.consumers.map((consumer: any) => ({
        id: consumer.consumer_id,
        name: consumer.consumer_name
      }));
  
      setConsumers(formattedConsumers);
      
      if (formattedConsumers.length > 0) {
        setSelectedConsumer(formattedConsumers[0].id);
      } else {
        setSelectedConsumer(null);
      }
    } catch (error) {
      const err = error as any;
      console.error('Error fetching consumers:', err);
      console.error('Error details:', err.response?.data || err.message);
      setConsumers([]);
      setSelectedConsumer(null);
    }
  };

  const fetchMessages = async (consumerId: string, chatbotId: string) => {
    setIsMessagesLoading(true);
    console.log("fetching messages with consumerId:", consumerId);
    console.log("fetching messages with chatbotId:", chatbotId);
    try {
      const response = await axios.get(
        `https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbot/${chatbotId}/${userId}/${consumerId}/get_messages_from_db/`
      );

      const fetchedMessages: Message[] = response.data.messages
        .map((msg: any, index: number) => ({
          id: index + 1,
          sender: msg.is_from_user ? 'User' : 'Chatbot', 
          content: msg.content,
          chatbot: `Chatbot${chatbotId}`,
          message_time: msg.timestamp
        }))
        .sort((a: Message, b: Message) => 
          new Date(a.message_time).getTime() - new Date(b.message_time).getTime()
        );

      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Event handlers
  const handleChatbotClick = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setSelectedConsumer(null); // Reset selected consumer when changing chatbot
    setMessages([]); // Clear messages when changing chatbot
  };

  // useEffect hooks
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
  }, []);

  // Fetch consumers whenever selected chatbot changes
  useEffect(() => {
    if (selectedChatbot?.chatbot_id) {
      fetchConsumers(selectedChatbot.chatbot_id.toString());
    }
  }, [selectedChatbot]);

  // Fetch messages when consumer, chatbot, or userId changes
  useEffect(() => {
    if (userId && selectedChatbot && selectedConsumer) {
      fetchMessages(selectedConsumer, selectedChatbot.chatbot_id.toString());
    }
  }, [selectedConsumer, selectedChatbot, userId]);
  
    return (
      <div className="flex h-full">
      {/* Toggle button for small screens */}
      <button
        className="md:hidden fixed top-4 right-4 z-40 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition-colors flex items-center gap-2"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
        <span>Conversation Menu</span>
      </button>
  
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-150/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
        
      {/* Sidebar */}
      <aside
        className={`w-64 bg-quinary flex-none fixed md:sticky top-0 h-full right-0 md:left-0
          transition-transform duration-300 ease-in-out shadow-lg shadow-gray-400/50 z-30
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
          md:translate-x-0`}
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
          isLoading={isLoading}
        />
      </aside>

      {/* Main content area */}
      <main className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? 'md:blur-none blur-sm' : ''}`}>
        {/* Header */}
        <header className="flex-none">
          <h2 className="text-2xl font-bold p-4 text-black bg-quinary border-b">
            Conversations with {selectedChatbot?.chatbot_name || 'Chatbot'}
          </h2>
        </header>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto bg-white">
          {isMessagesLoading ? <ChatSkeleton /> : (
            <div className="p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col h-full ">
                  <p className="text-gray-500 text-3xl font-bold">No Conversations Yet</p>
                </div>
              ) : (
                <>
                  {messages.reduce((acc: JSX.Element[], message, index) => {
                    const currentDate = new Date(message.message_time).toLocaleDateString();
                    const prevDate = index > 0 ? new Date(messages[index - 1].message_time).toLocaleDateString() : null;

                    if (currentDate !== prevDate) {
                      acc.push(
                        <div key={`date-${currentDate}`} className="flex items-center my-4">
                          <div className="flex-grow border-t border-dotted border-gray-300"></div>
                          <span className="mx-4 text-sm text-gray-500">{currentDate}</span>
                          <div className="flex-grow border-t border-dotted border-gray-300"></div>
                        </div>
                      );
                    }

                    acc.push(
                      <div
                        key={message.id}
                        className={`flex items-start space-x-2 mb-4 ${
                          message.sender === 'User' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {message.sender === 'User' && (
                          <div className="flex-shrink-0">
                            <User className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'User'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">{message.sender}</p>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.message_time).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            }) + ' ' + new Date(message.message_time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {message.sender !== 'User' && (
                          <div className="flex-shrink-0">
                            <MessageCircle className="h-8 w-8 text-blue-600" />
                          </div>
                        )}
                      </div>
                    );
                    return acc;
                  }, [])}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
    );
  };
  

  
export default ChatbotMessagesPage;

