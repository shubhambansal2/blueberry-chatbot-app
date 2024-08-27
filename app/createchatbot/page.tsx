'use client'
import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import axios from 'axios';
import { fetchChatbots, Chatbot } from '../../lib/chatbotsfetch';
import CreateChatbotBasicDetails from '../../components/create_chatbot_basic_details';
import DocumentUpload from '../../components/document_upload';


const CreateChatbotPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [actions, setActions] = useState('');
  const [dataSource, setDataSource] = useState('');

  const handleTabClick = (index: number) => {
    setCurrentStep(index);
  }

  
  const getChatbots = async () => {
      try {
        const chatbots = await fetchChatbots();
        setSavedChatbots(chatbots);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
      }
    }
  
  useEffect(() => {
    getChatbots();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // log that form is submitted
    console.log("Formsubmitted");
    console.log(name, personality, companyName, role);
    // get user from local storage
    const user = localStorage.getItem('user');
    const is_rag_enabled = false;
    const rag_source = "FAQ Database 1 and 2";
    const token = localStorage.getItem('accessToken');
    axios.post('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/', {
      chatbot_name: name,
      personality: personality,
      company_name: companyName,
      role: role,
      is_rag_enabled: is_rag_enabled,
      rag_source: rag_source,
      user: user
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Chatbot created successfully:', response.data);
      getChatbots();
    })
    .catch(error => {
      console.error('Error creating chatbot:', error);
    });
    setName('');
    setPersonality('');
    setCompanyName('');
    setRole('');

    alert('Chatbot created successfully');

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
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Chatbot</h1>

        {/* Tab Buttons */}
        <div className="flex border-b mb-8">
          <button
            onClick={() => handleTabClick(0)}
            className={`px-4 py-2 ${
              currentStep === 0
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Basic Details
          </button>
          <button
            onClick={() => handleTabClick(1)}
            className={`px-4 py-2 ${
              currentStep === 1
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => handleTabClick(2)}
            className={`px-4 py-2 ${
              currentStep === 2
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Actions
          </button>
        </div>

        <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <CreateChatbotBasicDetails
                name={name}
                setName={setName}
                personality={personality}
                setPersonality={setPersonality}
                role={role}
                setCompanyName={setCompanyName}
                companyName={companyName}
                setRole={setRole}
            />
          )}
          {currentStep === 1 && (
            <div>
              {/* Sources Form */}
             <DocumentUpload />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              {/* Actions Form */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Actions</label>
                <input
                  type="text"
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-150"
            >
              {currentStep === 2 ? "Finish" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  
  {/* <div className="mb-8">
  < h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-4">Your Chatbots</h2>
  <div className="flex flex-wrap -mx-4">
  {savedChatbots.map((bot) => (
    <div key={bot.chatbot_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{bot.chatbot_name}</h3>
          <p className="text-gray-600">Company: {bot.company_name}</p>
          <p className="text-gray-600">Role: {bot.role}</p>
          <p className="text-gray-600">Personality: {bot.personality}</p>
        </div>
      </div>
    </div> */}
    </div>
      
  );
};

export default CreateChatbotPage;