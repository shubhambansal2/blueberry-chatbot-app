'use client'
import React, { useState, useRef, useEffect } from 'react';
import messageSound from './Message.mp3';
import chatbotmaximize from './Chatbot_Maximize.mp3';
import chatbotminimize from './Chatbot_Minimize.mp3';
import { MessageCircle, X, Send } from 'lucide-react';
import MessageFormatter from './MessageFormatter' 
import axios from 'axios';


interface ChatWidgetProps {
  chatbotId: string;
  chatbotName: string;
  apiKey: string;
  accentColor?: string;
  consumerName?: string;
  consumerId?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

interface Product {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  url: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  chatbotId, 
  chatbotName, 
  apiKey,
  consumerName = `User ${Math.random().toString(36).substring(2, 8)}`,
  consumerId = Math.random().toString(36).substring(2, 8),
  accentColor = '#2563eb' // default to blue-600
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botAudioRef = useRef<HTMLAudioElement | null>(null);
  const botAudioRef2 = useRef<HTMLAudioElement | null>(null);
  const botAudioRef3 = useRef<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);


  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  // useEffect(() => {
  //   if (!consumerId) {
  //     // Generate a random 6-character consumer ID if none provided
  //     const randomId = Math.random().toString(36).substring(2, 8);
  //     console.log('Generated random consumer ID:', randomId);
  //   }
  // }, [consumerId]);

  // useEffect(() => {
  //   if (!consumerName) {
  //     // Generate a random consumer name if none provided
  //     const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Quinn', 'Avery', 'Parker', 'Blake', 'Charlie', 'Drew', 'Emerson', 'Frankie', 'Harper', 'Kennedy', 'London', 'Madison', 'Phoenix', 'Reagan', 'Sage', 'Sydney', 'Winter', 'Skylar', 'River', 'Robin', 'Storm', 'Tyler', 'Val'];
  //     const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
  //     const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  //     const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  //     const randomName = `${randomFirstName} ${randomLastName}`;
  //     console.log('Generated random consumer name:', randomName);
  //   }
  // }, [consumerName]);

  useEffect(() => {
    const initializeChatbot = async () => {
      if (!apiKey) {
        console.error('API key is required to initialize the chatbot');
        return;
      }
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      console.log('New Session:', newSessionId);
      setIsInitialized(true);
    };

    initializeChatbot();
  }, [apiKey]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Improved typewriter effect with smoother scrolling
  const typeWriterEffect = async (messageId: number, fullText: string) => {
    let currentText = '';
    const chunkSize = 2; // Number of characters to add at once
    
    for (let i = 0; i < fullText.length; i += chunkSize) {
      await new Promise(resolve => setTimeout(resolve, 30));
      currentText = fullText.slice(0, i + chunkSize);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, text: currentText, isTyping: i + chunkSize < fullText.length } : msg
        )
      );
      scrollToBottom();
    }
  };

  const sendMessage = async () => {
    if (!isInitialized) {
      console.error('Chatbot not initialized');
      return;
    }

    if (userInput.trim()) {
      const newUserMessage = { id: messages.length + 1, text: userInput, sender: 'user' } as Message;
      setMessages(prev => [...prev, newUserMessage]);
      setUserInput('');
      setIsLoading(true);
      scrollToBottom();

      try {
        const response = await fetch('https://desolate-bastion-55476-3d3016c3fa1a.herokuapp.com/chatwithcustombot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatbot_id: chatbotId,
            session_id: sessionId,
            input_message: userInput,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        setIsLoading(false);
        
        const botMessageId = messages.length + 2;
        const botResponse = {
          id: botMessageId,
          text: '',
          sender: 'bot',
          isTyping: true,
        } as Message;
        
        const userId = localStorage.getItem('user');
        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }
        
        setMessages(prev => [...prev, botResponse]);
        scrollToBottom();
        
        if (botAudioRef.current) {
          botAudioRef.current.play();
        }
        
        typeWriterEffect(botMessageId, data.response || 'I am having trouble processing your message. Please try again.');
        await axios.post(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbot/${chatbotId}/save_message_to_db/`, {
            session_id: sessionId,
            consumer_id: consumerId, // Assuming this is a constant value, adjust if needed
            consumer_name: consumerName,
            message: userInput,
            bot_message: data.response,
          }, {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => {
            console.log('Message saved to database:', response.data);
          }
          ).catch(error => {
            console.error('Error saving message to database:', error);
          });

      } catch (error) {
        console.error('Failed to get bot response:', error);
        setIsLoading(false);
      }
    }
  };

  const handleminimize = () => {
    setIsMinimized(true);
    if (botAudioRef3.current) {
      botAudioRef3.current.play();
    }
  };

  const handleMaximize = () => {
    if (!isInitialized) {
      console.error('Chatbot not initialized');
      return;
    }
    if (botAudioRef2.current) {
      botAudioRef2.current.play();
    }
    
    setIsMinimized(false);
    
    // Add delay to ensure DOM is updated before scrolling
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    if (isFirstTimeOpen) {
      setTimeout(() => {
        const welcomeMessageId = 1;
        const welcomeMessage = { 
          id: welcomeMessageId, 
          text: '', 
          sender: 'bot',
          isTyping: true 
        } as Message;
        setMessages([welcomeMessage]);
        typeWriterEffect(welcomeMessageId, `Hi! I am ${chatbotName}. How may I assist you today?`);
        if (botAudioRef.current) {
          botAudioRef.current.play();
        }
        // Add delay for welcome message scroll
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }, 1000);
      setIsFirstTimeOpen(false);
    }
  };

  const styles = `
    @keyframes loadingDot1 {
      0% { transform: translateY(0px); }
      25% { transform: translateY(-4px); }
      50%, 100% { transform: translateY(0px); }
    }
    
    @keyframes loadingDot2 {
      0%, 25% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
      75%, 100% { transform: translateY(0px); }
    }
    
    @keyframes loadingDot3 {
      0%, 50% { transform: translateY(0px); }
      75% { transform: translateY(-4px); }
      100% { transform: translateY(0px); }
    }
    
    .loading-dot:nth-child(1) {
      animation: loadingDot1 1.2s infinite;
    }
    
    .loading-dot:nth-child(2) {
      animation: loadingDot2 1.2s infinite;
    }
    
    .loading-dot:nth-child(3) {
      animation: loadingDot3 1.2s infinite;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .chat-widget-enter {
      animation: slideIn 0.3s ease-out;
    }

    .minimized-button {
      transition: transform 0.3s ease;
    }

    .minimized-button:hover {
      transform: scale(1.05);
    }

    .unread-indicator {
      animation: fadeIn 0.3s ease-out;
    }
  `;

  if (!isInitialized) {
    return null;
  }

  return (
    <>
    <style jsx>{styles}</style>
    {showWidget && (
      <div 
        className={`fixed bottom-4 right-4 z-50 ${
          isMinimized ? '' : 'chat-widget-enter'
        }`}
      >
        {isMinimized ? (
          // Enhanced minimized state
          <div className="relative inline-flex items-center">
            {/* Name appears as a message bubble */}
            <div className="flex items-center">
              <span className="font-medium text-gray-700 bg-white px-4 py-2 rounded-l-lg shadow-md">
                {chatbotName}
              </span>
              {/* White background that extends behind the button */}
              <div className="h-10 w-8 bg-white shadow-md"></div>
            </div>
            
            {/* Original circular button with increased overlap */}
            <button
              onClick={handleMaximize}
              className="minimized-button flex items-center justify-center w-16 h-16 rounded-full shadow-lg text-white -ml-6"
              style={{ backgroundColor: accentColor }}
            >
              <MessageCircle size={28} color='white' />
              {hasUnreadMessages && (
                <span className="unread-indicator absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            
            {isFirstTimeOpen && (
              <div className="absolute bottom-20 right-0 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64 chat-widget-enter">
                <p className="text-sm">👋 Hi There, Need help? I am here to assist you.</p>
                <div 
                  className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"
                  style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}
                />
              </div>
            )}
          </div>
        ) : (
          // Enhanced maximized state
          <div className="bg-white  shadow-xl w-96 h-[600px] flex flex-col rounded-2xl">
          {/* Fixed Header */}
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between rounded-xl">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white rounded-xl"
                style={{ backgroundColor: accentColor }}
              >
                <MessageCircle size={20} color='white' />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{chatbotName}</h3>
                <p className="text-xs text-gray-500">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={handleminimize}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" color='black'/>
            </button>
          </div>

          
    
          {/* Fixed Height Chat Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-2xl"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {message.sender === 'bot' && !message.isTyping ? (
                    <MessageFormatter message={message.text} />
                  ) : (
                    message.text
                  )}
                  {message.isTyping && (
                    <span className="inline-flex space-x-1 ml-1">
                      <span className="loading-dot text-xl">.</span>
                      <span className="loading-dot text-xl">.</span>
                      <span className="loading-dot text-xl">.</span>
                    </span>
                  )}
                </div>
        
               
              </div>
                ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-white text-gray-800 shadow-sm">
                  <span className="inline-flex space-x-1">
                    <span className="loading-dot text-2xl font-bold">.</span>
                    <span className="loading-dot text-2xl font-bold">.</span>
                    <span className="loading-dot text-2xl font-bold">.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
    
          {/* Fixed Input Area */}
          <div className="p-4 bg-white border-t rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="p-3 rounded-full transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                <Send size={20} className="text-white" color='white' />
              </button>
            </div>
            <div className="text-center mt-3 text-xs font-semibold text-black rounded-xl">
              Powered by Purpleberry AI
            </div>
          </div>
        </div>
    
        )}
      </div>
    )}
    <audio ref={botAudioRef} src={messageSound}/>
    <audio ref={botAudioRef2} src={chatbotminimize}/>
    <audio ref={botAudioRef3} src={chatbotmaximize}/>
  </>
);
};

export default ChatWidget;