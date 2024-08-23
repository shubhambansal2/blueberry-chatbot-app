'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ChatbotWindow from '../../../components/chatbot';
import { fetchChatbotById, Chatbot } from '../../../lib/chatbotsfetchbyid';

const ChatbotEmbed = () => {
    const [chatbot, setChatbot] = useState<Chatbot | null>(null);
    const params = useParams();
  
    useEffect(() => {
      const fetchChatbot = async () => {
        console.log('Params:', params);
        const chatbotId = parseInt(params.slug as string, 10); // Change 'id' to 'slug'
        console.log('Chatbot ID:', chatbotId);
  
        if (!isNaN(chatbotId)) {
          try {
            console.log('Fetching chatbot...');
            const fetchedChatbot = await fetchChatbotById(chatbotId);
            console.log('Fetched chatbot:', fetchedChatbot);
            setChatbot(fetchedChatbot);
          } catch (error) {
            console.error('Failed to fetch chatbot:', error);
          }
        } else {
          console.error('Invalid chatbot ID');
        }
      };
  
      fetchChatbot();
    }, [params.slug]); // Change dependency to params.slug
  
    console.log('Current chatbot state:', chatbot);
  
    if (!chatbot) {
      return <div>
        <p>Loading...</p>
        <p>Params: {JSON.stringify(params)}</p>
      </div>;
    }
  
    return (
      <div className="h-screen w-full">
        <ChatbotWindow
          chatbot={chatbot}
          onClose={() => {}}
        />
      </div>
    );
  };
  
  export default ChatbotEmbed;