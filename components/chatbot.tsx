import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Message } from 'postcss';
import { Chatbot } from '@/lib/chatbotsfetch';

const ChatbotWindow = ({ chatbot, onClose }: { chatbot: Chatbot; onClose: () => void }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    (messagesEndRef.current as unknown as HTMLDivElement)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
  
    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, { ...newMessage, type: 'default' }]);
    setInputMessage('');
  
    // Retrieve user ID from localStorage
    const userId = localStorage.getItem('user');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:5100/chatwithcustombot', {
        chatbot_id: chatbot.chatbot_id,
        input_message: inputMessage,
        session_id: sessionId
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      const botResponse = { text: response.data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, { ...botResponse, type: 'default' }]);
  
      // New API call to save messages to the database
      await axios.post(`http://localhost:8000/api/users/chatbot/${chatbot.chatbot_id}/${userId}/save_message_to_db/`, {
        session_id: sessionId,
        consumer_id: "1", // Assuming this is a constant value, adjust if needed
        message: inputMessage,
        bot_message: response.data.response
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        console.log('Message saved to database:', response.data);
      }
      ).catch(error => {
        console.error('Error saving message to database:', error);
      });
    } catch (error) {
      console.error('Error sending message or saving to database:', error);
      setMessages(prevMessages => [...prevMessages, { text: "Sorry, I'm having trouble responding right now.", sender: 'bot', type: 'default' }]);
    }
  };

  const startChat = () => {
    setIsMinimized(false);
    setMessages([{
      text: `Hello! How can I help you today?`, sender: 'bot',
      type: ''
    }]);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {isMinimized ? (
        <div className="bg-green-200 rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-green-800">🍉 {chatbot.chatbot_name}</h3>
            <button onClick={onClose} className="text-green-800">&times;</button>
          </div>
          <p className="mb-4">Start your chat with {chatbot.chatbot_name}, our friendly chatbot</p>
          <button 
            onClick={startChat}
            className="w-full bg-green-500 text-white py-2 rounded-lg mb-4"
          >
            Send us a message
          </button>
          <div className="text-sm text-gray-600 mb-2">CONNECT WITH US</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="mr-2">📱</span> WhatsApp
            </div>
            <div className="flex items-center">
              <span className="mr-2">👥</span> Facebook
            </div>
            <div className="flex items-center">
              <span className="mr-2">✉️</span> Email
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">🍉 {chatbot.chatbot_name}</h3>
            <div>
              <button onClick={() => setIsMinimized(true)} className="mr-2">_</button>
              <button onClick={onClose}>&times;</button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
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
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-200 text-black"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 transition duration-150"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWindow;

// // components/ChatbotWindow.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// interface Chatbot {
//   chatbot_id: number;
//   chatbot_name: string;
//   company_name: string;
//   role: string;
//   personality: string;
// }

// interface Message {
//   text: string;
//   sender: 'user' | 'bot';
// }

// interface ChatbotWindowProps {
//   chatbot: Chatbot;
//   onClose: () => void;
// }

// const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ chatbot, onClose }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState<string>('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [session_id, setSessionId] = useState<string>('');
//   const [isMinimized, setIsMinimized] = useState<boolean>(false);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   useEffect(() => {
//     setMessages([]);
//     setSessionId(Math.random().toString(36).substring(7));
//   }, [chatbot.chatbot_id]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (inputMessage.trim() === '') return;

//     const newMessage: Message = { text: inputMessage, sender: 'user' };
//     setMessages([...messages, newMessage]);
//     setInputMessage('');

//     axios.post('https://desolate-bastion-55476-3d3016c3fa1a.herokuapp.com/chatwithcustombot', {
//       chatbot_id: chatbot.chatbot_id,
//       input_message: inputMessage,
//       session_id: session_id
//     }, {
//       headers: { 'Content-Type': 'application/json' }
//     })
//     .then(response => {
//       const backendResponse: Message = { text: response.data.response, sender: 'bot' };
//       setMessages(prevMessages => [...prevMessages, backendResponse]);
//     })
//     .catch(error => {
//       console.error('Error sending message:', error);
//     });
//   };

//   return (
//     <>
//       {isMinimized ? (
//         <div
//           className="fixed bottom-4 right-4 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
//           onClick={() => setIsMinimized(false)}
//         >
//           <h3 className="text-white text-lg font-bold">{chatbot.chatbot_name.charAt(0)}</h3>
//         </div>
//       ) : (
//         <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
//           <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
//             <h3 className="font-bold">{chatbot.chatbot_name}</h3>
//             <div className="flex">
//               <button onClick={() => setIsMinimized(true)} className="text-gray-300 hover:text-black mr-2">
//                 _
//               </button>
//               <button onClick={onClose} className="text-gray-300 hover:text-black">
//                 &times;
//               </button>
//             </div>
//           </div>
//           <div className="flex-1 p-4 overflow-y-auto">
//             {messages.map((message, index) => (
//               <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
//                 <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-black' : 'bg-gray-200 text-gray-800'}`}>
//                   {message.text}
//                 </span>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//           <form onSubmit={handleSendMessage} className="p-4 border-t">
//             <div className="flex">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
//                 className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
//                 placeholder="Type a message..."
//               />
//               <button
//                 type="submit"
//                 className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 transition duration-150"
//               >
//                 Send
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatbotWindow;