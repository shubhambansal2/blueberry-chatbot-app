// components/ChatbotWindow.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Chatbot {
  id: number;
  name: string;
  company: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotWindowProps {
  chatbot: Chatbot;
  onClose: () => void;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ chatbot, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newMessage: Message = { text: inputMessage, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate backend response
    setTimeout(() => {
      const backendResponse: Message = { text: "Backend Response", sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, backendResponse]);
    }, 1000);
  };

  return (
    <div className="fixed  w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">{chatbot.name}</h3>
        <button onClick={onClose} className="text-gray-300 hover:text-white">
          &times;
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 transition duration-150"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotWindow;