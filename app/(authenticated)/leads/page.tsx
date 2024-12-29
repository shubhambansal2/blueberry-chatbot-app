'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Chatbot, fetchChatbots } from '../../../lib/chatbotsfetch';
// Types
// interface Chatbot {
//   chatbot_id: string;
//   chatbot_name: string;
// }

interface Lead {
  id: string;
  email: string;
  phone: string;
}

export default function LeadsPage() {
  // State
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chatbots
  const getChatbots = async () => {
    setIsLoadingChatbots(true);
    const chatbots = await fetchChatbots();
    setChatbots(chatbots);
    console.log(chatbots);
    setIsLoadingChatbots(false);
  };


  // Fetch leads for selected chatbot
  const fetchLeads = async (chatbotId: string) => {
    try {
      setIsLoadingLeads(true);
      setError(null);
      const userId = localStorage.getItem('user');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await axios.get(
        `https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_leads/${chatbotId}/`
      );

      const formattedLeads = response.data.leads.map((lead: any) => ({
        
        email: lead.email,
        phone: lead.phone,
        
      }));

      setLeads(formattedLeads);
    } catch (err) {
      setError('Failed to fetch leads. Please try again.');
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // Initial fetch of chatbots
  useEffect(() => {
    getChatbots();
  }, []);

  // Fetch leads when selected chatbot changes
  useEffect(() => {
    if (selectedChatbot) {
      fetchLeads(selectedChatbot);
    }
  }, [selectedChatbot]);

  const handleChatbotSelect = (chatbot_id: string) => {
    setSelectedChatbot(chatbot_id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Leads Dashboard</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chatbots List */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Your Chatbots</h2>
            {isLoadingChatbots ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <div className="space-y-3">
                {chatbots.map((chatbot) => (
                  <div 
                    key={chatbot.chatbot_id}
                    className={`p-3 rounded-md cursor-pointer border transition-colors
                      ${selectedChatbot === String(chatbot.chatbot_id) 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    onClick={() => handleChatbotSelect(String(chatbot.chatbot_id))}
                  >
                    <p className="font-medium">{chatbot.chatbot_name}</p>
                  </div>
                ))}
                {chatbots.length === 0 && (
                  <p className="text-gray-500 text-center p-4">No chatbots found</p>
                )}
              </div>
            )}
          </div>

          {/* Leads Table */}
          <div className="md:col-span-3 bg-white rounded-lg shadow">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Leads</h2>
              {isLoadingLeads ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>     
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No leads found for this chatbot
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}