'use client'
import React, { useState, useRef, useEffect } from 'react';
import messageSound from './Message.mp3';
import chatbotmaximize from './Chatbot_Maximize.mp3';
import chatbotminimize from './Chatbot_Minimize.mp3';
import { MessageCircle, X, Send, Loader2, LoaderCircle, Sparkles, WandSparkles, Maximize2, Minimize2, Wand, WandSparklesIcon } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import MessageFormatter from './MessageFormatter' 
import axios from 'axios';
import ProductCarousel from './ProductCarousel';

interface ChatWidgetProps { 
  chatbotId: string;
  chatbotName: string;
  apiKey: string;
  accentColor?: string;
  consumerName?: string;
  consumerId?: string;
  customerData?: {
    consumerName?: string;
    consumerId?: string;
  };
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
  products?: Product[];
}

interface Product {
  image_url: string;
  product_name: string;
  product_description: string;
  link: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  chatbotId, 
  chatbotName, 
  apiKey,
  accentColor, // default to blue-600
  customerData  // Provide a default empty object
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [showFaqs, setShowFaqs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botAudioRef = useRef<HTMLAudioElement | null>(null);
  const botAudioRef2 = useRef<HTMLAudioElement | null>(null);
  const botAudioRef3 = useRef<HTMLAudioElement | null>(null);
  const botAudioRef4 = useRef<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [productCarousel, setProductCarousel] = useState<Product[] | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState<string[]>([
    "Recommend some awesome products",
    "What is your return and refund policy",
  ]);

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  // Update suggested questions from API response
  const updateSuggestedQuestions = (suggestedQuestions: string[] | undefined) => {
    if (suggestedQuestions && Array.isArray(suggestedQuestions)) {
      setPredefinedQuestions(suggestedQuestions);
      storeSuggestedQuestions(suggestedQuestions);
    } else {
      // Keep default questions if no suggestions provided
      const defaultQuestions = [
        "Recommend some awesome products",
        "What is your return and refund policy",
      ];
      setPredefinedQuestions(defaultQuestions);
      storeSuggestedQuestions(defaultQuestions);
    }
  };

  const getStoredSessionData = () => {
    const storedData = localStorage.getItem(`chatbot_session_${chatbotId}`);
    if (storedData) {
      const { sessionId, expiryTime } = JSON.parse(storedData);
      if (new Date().getTime() < expiryTime) {
        return sessionId;
      }
    }
    return null;
  };

  const storeSessionData = (sessionId: string) => {
    const expiryTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 7 days from now
    localStorage.setItem(`chatbot_session_${chatbotId}`, JSON.stringify({
      sessionId,
      expiryTime
    }));
  };

  const storeMessages = (newMessages: Message[]) => {
    localStorage.setItem(`chatbot_messages_${chatbotId}`, JSON.stringify(newMessages));
  };

  // Function to retrieve stored messages
  const getStoredMessages = () => {
    const storedMessages = localStorage.getItem(`chatbot_messages_${chatbotId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  };

  // Function to store suggested questions
  const storeSuggestedQuestions = (questions: string[]) => {
    localStorage.setItem(`chatbot_suggested_questions_${chatbotId}`, JSON.stringify(questions));
  };

  // Function to retrieve stored suggested questions
  const getStoredSuggestedQuestions = () => {
    const storedQuestions = localStorage.getItem(`chatbot_suggested_questions_${chatbotId}`);
    return storedQuestions ? JSON.parse(storedQuestions) : [
      "Recommend some awesome products",
      "What is your return and refund policy",
    ];
  };

  useEffect(() => {
    if (messages.length > 0) {
      storeMessages(messages);
    }
  }, [messages, chatbotId]);

  const handlePredefinedQuestion = async (question: string) => {
    if (!isInitialized || isLoading) { // Added isLoading check
      console.error('Chatbot not initialized or is currently loading');
      return;
    }

    setShowFaqs(false);

    const newUserMessage = { id: messages.length + 1, text: question, sender: 'user' } as Message;
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await fetch('https://desolate-bastion-55476-3d3016c3fa1a.herokuapp.com/chatwithproductrecommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          session_id: sessionId,
          input_message: question,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const input_message = question;

      const data = await response.json();
      setIsLoading(false);
      
      const botMessageId = messages.length + 2;
      const botResponse: Message = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        isTyping: true,
        products: data.response?.products?.length > 0 ? data.response.products : undefined,
      };
      
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
      
      if (botAudioRef.current) {
        botAudioRef.current.play();
      }

      // Set product carousel if products exist
      // Only update product carousel if products exist in response
      if (data.response?.products?.length > 0) {
        setProductCarousel(data.response.products);
      }

      // Extract text response from nested response object
      const textResponse = data.response.response || 'I am having trouble processing your message. Please try again.';
      
      // Update suggested questions from API response
      updateSuggestedQuestions(data.response?.suggested_user_response);
      
      typeWriterEffect(botMessageId, textResponse);

      await axios.post(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbot/${chatbotId}/save_message_to_db/`, {
        session_id: sessionId,
        consumer_id: customerData?.consumerId,
        consumer_name: customerData?.consumerName,
        message: input_message,
        bot_message: textResponse,
      });

    } catch (error) {
      console.error('Failed to get bot response:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeChatbot = async () => {
      if (!apiKey) {
        console.error('API key is required to initialize the chatbot');
        return;
      }
      const existingSessionId = getStoredSessionData();
      const storedMessages = getStoredMessages();
      const storedQuestions = getStoredSuggestedQuestions();
      
      if (existingSessionId) {
        setSessionId(existingSessionId);
        if (storedMessages.length > 0) {
          setMessages(storedMessages);
          setIsFirstTimeOpen(false); // Prevent welcome message if we have stored messages
        }
        // Load stored suggested questions
        setPredefinedQuestions(storedQuestions);
        console.log('Restored existing session:', existingSessionId);
      } else {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        storeSessionData(newSessionId);
        // Clear stored messages and questions when creating new session
        localStorage.removeItem(`chatbot_messages_${chatbotId}`);
        localStorage.removeItem(`chatbot_suggested_questions_${chatbotId}`);
        console.log('Created new session:', newSessionId);
      }
      
      setIsInitialized(true);
    };

    initializeChatbot();
  }, [apiKey, chatbotId]);

  // Show welcome message when chatbot is initialized and maximized by default
  useEffect(() => {
    if (isInitialized && isFirstTimeOpen && !isMinimized && messages.length === 0) {
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
      setIsFirstTimeOpen(false);
    }
  }, [isInitialized, isFirstTimeOpen, isMinimized, messages.length, chatbotName]);

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

  useEffect(() => {
    return () => {
      // Only clean up if session is expired
      const storedData = localStorage.getItem(`chatbot_session_${chatbotId}`);

      if (storedData) {
        const { expiryTime } = JSON.parse(storedData);
        if (new Date().getTime() >= expiryTime) {
          localStorage.removeItem(`chatbot_session_${chatbotId}`);
          localStorage.removeItem(`chatbot_messages_${chatbotId}`);
          localStorage.removeItem(`chatbot_suggested_questions_${chatbotId}`);
        }
      }
    };
  }, [chatbotId]);

  // Improved typewriter effect with smoother scrolling and formatting
  const typeWriterEffect = async (messageId: number, fullText: string) => {
    setIsTyping(true);
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
    setIsTyping(false);
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
        const response = await fetch('https://desolate-bastion-55476-3d3016c3fa1a.herokuapp.com/chatwithproductrecommendations', {
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
        const botResponse: Message = {
          id: botMessageId,
          text: '',
          sender: 'bot',
          isTyping: true,
          products: data.response?.products?.length > 0 ? data.response.products : undefined,
        };
        
        setMessages(prev => [...prev, botResponse]);
        scrollToBottom();
        
        if (botAudioRef.current) {
          botAudioRef.current.play();
        }

        // Set product carousel if products exist
        // Only update product carousel if products exist in response
        if (data.response?.products?.length > 0) {
          setProductCarousel(data.response.products);
        }
        // Don't set to null if no products, keep existing carousel

        // Extract text response from nested response object
        const textResponse = data.response.response || 'I am having trouble processing your message. Please try again.';
        
        // Update suggested questions from API response
        updateSuggestedQuestions(data.response?.suggested_user_response);
        
        typeWriterEffect(botMessageId, textResponse);

        await axios.post(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbot/${chatbotId}/save_message_to_db/`, {
            session_id: sessionId,
            consumer_id: customerData?.consumerId,
            consumer_name: customerData?.consumerName,
            message: userInput,
            bot_message: textResponse,
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
  };

  const styles = `
    .chat-widget {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 50;
    }

   .chat-widget.maximized {
 position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none; 
}

    .minimized-state {
      display: inline-flex;
      align-items: center;
      position: relative;
    }

    .chat-name-bubble {
      display: flex;
      align-items: center;
    }

    .chat-name {
      font-weight: 500;
      color: #374151;
      background-color: white;
      padding: 8px 16px;
      border-radius: 8px 0 0 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .chat-name-extension {
      height: 40px;
      width: 32px;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .minimized-button {
      border: none;
      outline: none;
      box-shadow: none;
      -webkit-appearance: none;
      appearance: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-left: -24px;
      transition: transform 0.3s ease;
    }

    .minimized-button:hover {
      transform: scale(1.05);
    }

    .start-chat-button {
      border: none;
      outline: none;
      box-shadow: none;
      -webkit-appearance: none;
      appearance: none;
      font-size: 12px !important;
      background-color: ${accentColor};
      width: 100%; /* Updated width */
      height: 41px;
      padding: 0.625rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-sizing: border-box; /* Added box-sizing */
    }

    .unread-indicator {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      background-color: #EF4444;
      border-radius: 50%;
      border: 2px solid white;
    }

    .welcome-bubble {
      position: absolute;
      bottom: 80px;
      right: 0;
      background-color: white;
      color: #1F2937;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 16px;
      width: 256px;
      animation: slideIn 0.3s ease-out;
    }

    .welcome-bubble-arrow {
      position: absolute;
      bottom: -8px;
      right: 24px;
      width: 16px;
      height: 16px;
      background-color: white;
      transform: rotate(45deg);
      clip-path: polygon(0 0, 100% 100%, 100% 0);
    }

    .maximized-widget {
       background-color: white;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        width: ${isMaximized ? 'min(800px, 90vw)' : 'min(500px, 90vw)'};
        height: ${isMaximized ? 'min(750px, 85vh)' : 'min(700px, 85vh)'};
        min-height: ${isMaximized ? '500px' : '400px'};
        max-height: 85vh; 
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        transition: width 0.3s, height 0.3s;
        pointer-events: auto;
    }

    .widget-header {
  padding: 16px;
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h3 {
  border: none;
  outline: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  font-weight: 600;
  color: #1F2937;
  font-size: 16px;
  line-height: 1.2;
}

.header-text p {
  border: none;
  outline: none;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
  font-size: 12px;
  color: #6B7280;
  margin: 0;
  padding: 0;
}

  .close-button {
      border: none;
    outline: none;
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  .close-button:hover {
    background-color: #F3F4F6;
  }
  .chat-container {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 16px;
    background-color: #F9FAFB;
    border-radius: 16px;
    min-height: 200px;
  }
  .input-phone, .input-email { /* Updated selector */
      font-size: 12px !important;
      width: 100%; /* Updated width */
      height: 43px;
      padding: 0.625rem;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      background-color: white;
      color: black;
      outline: none;
      box-sizing: border-box; /* Added box-sizing */
  }
  .message-wrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    }

    .message-wrapper.user {
      align-items: flex-end;
    }

    .message-wrapper.bot {
      align-items: flex-start;
    }

    .message {
      padding: 8px 16px;
      border-radius: 8px;
      max-width: 80%;
    }

    .message.user {
      background-color: ${accentColor};
      color: white;
    }

    .message.bot {
      background-color: white;
      color: #1F2937;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .input-area {
      padding: 16px;
      background-color: white;
      border-top: 1px solid #E5E7EB;
      border-radius: 0 0 16px 16px;
    }

    .input-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-input {
      flex: 1;
      padding: 12px;
      border: 1px solid #E5E7EB;
      border-radius: 24px;
      background-color: #F9FAFB;
      font-size: 14px;
      color: black;
    }
  
    .chat-input:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
    }

    .send-button {
      border: none;
      outline: none;
      box-shadow: none;
      -webkit-appearance: none;
      appearance: none;
      padding: 12px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .powered-by {
      text-align: center;
      margin-top: 12px;
      font-size: 12px;
      color: #000000;
      font-weight: 600;
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
    .faq-container {
                border: none;
                outline: none;
                box-shadow: none;
                -webkit-appearance: none;
                appearance: none;
                font-size: 12px !important;
                padding: 1rem;
                background-color: none;
                border-radius: 0 0 1rem 1rem;
                display: flex; /* Added display */
                flex-direction: column; /* Added flex-direction */
              }
              
    .faq-button {
       border: none;
      outline: none;
      box-shadow: none;
      -webkit-appearance: none;
      appearance: none;
      display: flex;
      height: 21px;
      align-items: center;
      gap: 0.25rem;
      font-size: 14px !important;
      color: white;
      margin-bottom: 0.5rem;
    }
    
    .faq-button:hover {
      color: #f3f4f6;
    }
    
    .questions-container {      
     border: none;
      outline: none;
      box-shadow: none;
      -webkit-appearance: none;
      appearance: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

 .chat-form-container {
  padding: 1rem;
  font-size: 12px !important;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chat-form-layout {
  font-size: 12px !important;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
}
    
    .question-button {
     border: none;
      outline: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      -webkit-appearance: none;
      appearance: none;
     font-size: 12px !important;
      height: 30px;
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      background-color: white;
      color: #374151;
      border: 1px solid #D1D5DB;
      transition: all 0.2s;
      white-space: nowrap;
    }
    
    .question-button:hover {
      background-color: #F9FAFB;
      border-color: #9CA3AF;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .loading-dot {
      font-size: 24px;
      font-weight: bold;
      display: inline-block;
    }

    .loading-dot:nth-child(1) { animation: loadingDot1 1.2s infinite; }
    .loading-dot:nth-child(2) { animation: loadingDot2 1.2s infinite; }
    .loading-dot:nth-child(3) { animation: loadingDot3 1.2s infinite; }

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
  .loader-spin {
  animation: spin 1s linear infinite;
}

  @keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
  .modern-spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    min-height: 60px;
    padding: 8px 0;
  }
  .modern-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    position: relative;
    margin-bottom: 8px;
  }
  .spinner-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid #e5e7eb;
    border-top: 4px solid ${accentColor || '#2563EB'};
    border-radius: 50%;
    animation: modern-spin 1s linear infinite;
  }
  .spinner-segment:nth-child(2) {
    border-top: 4px solid #a5b4fc;
    animation-delay: 0.25s;
  }
  .spinner-segment:nth-child(3) {
    border-top: 4px solid #818cf8;
    animation-delay: 0.5s;
  }
  .spinner-segment:nth-child(4) {
    border-top: 4px solid #6366f1;
    animation-delay: 0.75s;
  }
  @keyframes modern-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .chat-widget.maximized {
      max-width: 95vw;
      max-height: 95vh;
    }
    
    .maximized-widget {
      width: min(95vw, 400px) !important;
      height: min(90vh, 600px) !important;
      min-height: 400px !important;
      max-height: 90vh !important;
      margin-bottom: 20px;
    }
  }

  @media (max-height: 600px) {
    .chat-widget.maximized {
      max-height: 95vh;
    }
    
    .maximized-widget {
      height: min(95vh, 500px) !important;
      min-height: 300px !important;
      max-height: 95vh !important;
      margin-bottom: 20px;
    }
  }
  .loading-text {
    font-size: 13px;
    color: #6B7280;
    text-align: center;
    margin-top: 2px;
    font-weight: 500;
    line-height: 1.4;
  }
  .bouncing-loader-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-width: 60px;
    min-height: 32px;
    padding: 0;
    margin-left: 4px;
    background: transparent !important;
  }
  .bouncing-loader {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    height: 24px;
    gap: 7px;
    margin-bottom: 0;
    background: transparent !important;
  }
  .bouncing-loader > div {
    width: 12px;
    height: 12px;
    background: linear-gradient(135deg, ${accentColor || '#6366f1'} 60%, #a5b4fc 100%);
    border-radius: 50%;
    animation: bouncing-loader-bounce 0.6s infinite alternate;
    box-shadow: 0 0 8px 2px ${accentColor || '#6366f1'}33;
  }
  .bouncing-loader > div:nth-child(2) {
    animation-delay: 0.2s;
  }
  .bouncing-loader > div:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes bouncing-loader-bounce {
    to {
      transform: translateY(-12px) scale(1.15);
      box-shadow: 0 8px 16px 0 ${accentColor || '#6366f1'}44;
    }
  }
  .loading-text {
    font-size: 14px;
    color: #6366f1;
    text-align: center;
    margin-top: 2px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 8px #a5b4fc33;
  }
  .product-carousel-wrapper {
    animation: glideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }
  @keyframes glideIn {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  `;

  if (!isInitialized) {
    return null;
  }

  return (
    <>
    <style jsx>{styles}</style>
    {showWidget && (
      <div className={`chat-widget ${isMinimized ? '' : 'maximized'}`}>
        
        {isMinimized ? (
          <div className="minimized-state">
          <button
            onClick={handleMaximize}
            className="minimized-button"
            style={{ backgroundColor: accentColor }}
          >
            <Sparkles size={28} color="white" fill='white' />
          </button>
          {isFirstTimeOpen && (
                <div className="welcome-bubble">
                  <p>👋 Hi There, Need help? I am here to assist you.</p>
                  <div className="welcome-bubble-arrow" />
                </div>
              )}
            </div>
          ) :  (
          // Enhanced maximized state
          <div 
            className="maximized-widget"
            style={{
              width: isMaximized ? 'min(800px, 90vw)' : 'min(500px, 90vw)',
              height: isMaximized ? 'min(750px, 85vh)' : 'min(700px, 85vh)',
              minHeight: isMaximized ? '500px' : '400px',
              maxHeight: '85vh',
              backgroundColor: 'white',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'width 0.3s, height 0.3s',
            }}
          >
            <div className="widget-header">
              <div className="header-info">
                <div 
                  className="header-avatar"
                  style={{ backgroundColor: accentColor }}
                >
                  <MessageSquare size={20} color="white" fill='white' />
                </div>
                <div className="header-text">
                  <h3>{chatbotName}</h3>
                  <p>Typically replies instantly</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: '4px'}}>
                <button onClick={() => setIsMaximized(m => !m)} className="close-button" title={isMaximized ? 'Restore' : 'Maximize'}>
                  {isMaximized ? <Minimize2 size={20} color="black" /> : <Maximize2 size={20} color="black" />}
                </button>
                <button onClick={handleminimize} className="close-button" title="Minimize">
                  <X size={20} color="black" />
                </button>
              </div>
            </div>
          {/* Fixed Height Chat Container */}
          <div ref={chatContainerRef} className="chat-container">
                {messages.map((message, idx) => (
                  <React.Fragment key={message.id}>
                    <div className={`message-wrapper ${message.sender}`}>
                      <div className={`message ${message.sender}`}>
                        {message.sender === 'bot' ? (
                          <MessageFormatter message={message.text} />
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                    {/* Show product carousel below any bot message that has products, only after typewriter effect is done */}
                    {message.sender === 'bot' && message.products && message.products.length > 0 && !message.isTyping && (
                      <div className="product-carousel-wrapper">
                        <ProductCarousel products={message.products} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
            {isLoading && (
                  <div className="message-wrapper bot">
                    <div className="message bot">
                      <div className="bouncing-loader-container">
                        <div className="bouncing-loader">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                )}
            <div ref={messagesEndRef}/>
          </div>
          <div className="faq-container">
            <div>
              {!isLoading && !isTyping && (
                <div className="questions-container">
                  {predefinedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handlePredefinedQuestion(question)}
                      className="question-button"
                      title={question.length > 70 ? question : undefined}
                    >
                      {question.length > 70 ? `${question.substring(0, 70)}` : question}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="input-area">
              <div className="input-container">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask AI Anything ✨" style={{color: 'black'}}
                    className="chat-input"
                    onKeyPress={(e) => !isLoading && e.key === 'Enter' && sendMessage()}
                  />
                  <button
                  onClick={sendMessage}
                  className="send-button"
                  style={{ backgroundColor: accentColor }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Sparkles size={20} color="white" className="animate-pulse" />
                  ) : (
                    <Sparkles size={20} color="white" />
                  )}
                </button>
              </div>
              </div>
              <div className="powered-by">
             <a href="https://www.purpleberryai.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-500 hover:text-blue-500">Powered by Purpleberry AI</a>
            </div>
          </div>
        </div>    
        )}
      </div>
    )}
    <audio ref={botAudioRef} src={messageSound}/>
    <audio ref={botAudioRef2} src={chatbotminimize}/>
    <audio ref={botAudioRef3} src={chatbotmaximize}/>
    <audio ref={botAudioRef4} src={messageSound}/>
  </>
);
};

export default ChatWidget;