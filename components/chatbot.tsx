// components/ChatbotWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';


interface Chatbot {
  chatbot_id: number;
  chatbot_name: string;
  company_name: string;
  role: string;
  personality: string;
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
  const [session_id, setSessionId] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // clear messages when new chatbot is selected
    setMessages([]);
    setSessionId(Math.random().toString(36).substring(7));
  }
  , [chatbot.chatbot_id]);

  

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    const newMessage: Message = { text: inputMessage, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    // send message and chatbot id to backend using axios
    axios.post('https://desolate-bastion-55476-3d3016c3fa1a.herokuapp.com/chatwithcustombot', {
      chatbot_id: chatbot.chatbot_id,
      input_message: inputMessage,
      session_id: session_id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Message sent successfully:', response.data);
      // Access response.data.response instead of response.data
      const backendResponse: Message = { text: response.data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, backendResponse]);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
};

  return (
    <div className="fixed ml-80 mt-80 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">{chatbot.chatbot_name}</h3>
        <button onClick={onClose} className="text-gray-300 hover:text-black">
          &times;
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-black' : 'bg-gray-200 text-gray-800'}`}>
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
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
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