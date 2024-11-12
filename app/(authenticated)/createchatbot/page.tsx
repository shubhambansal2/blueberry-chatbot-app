'use client'
import React, { useState, useEffect } from 'react';
import { FloatingDock } from "../../../components/ui/Floating_dock";
import { BackgroundGradient } from '../../../components/ui/background_gradient';
import Link from 'next/link';
import { useChatbotStore } from '../../../store/useChatbotStore';
import { useRouter } from 'next/navigation';
import ActivationDialog from '../../../components/ActivationDialogue';
import { CompanyDetailsForm } from '../../../components/forms/CompanyDetailsForm';
import { DataSourcesForm } from '../../../components/forms/DataSourcesForm';
import { ChatbotDetailsForm } from '../../../components/forms/ChatbotDetailsForm';
import { SpecialInstructionsForm } from '@components/forms/SpecialInstructionsForm';
import  ActivationForm  from '../../../components/forms/ActivationForm';

import {
  IconMessageChatbot,
  IconBuildings,
  IconFloatLeft,
  IconDatabase,
  IconChecks,
} from "@tabler/icons-react";

// const {
//   resetForm
// } = useChatbotStore();

const formComponents: Record<string, React.FC> = {
  'company-details': CompanyDetailsForm,
  'data-sources': DataSourcesForm,
  'chatbot-details': ChatbotDetailsForm,
  'special-instructions': SpecialInstructionsForm,
  'activation': ActivationForm
  // Add other form components...
};


const CreateChatbotPage = () => {
  

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const items = [
   
    {
      id: "chatbot-details",
      title: "Chatbot Details",
      details: "Enter the chatbot details",
      icon: (
        <IconMessageChatbot className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "company-details",
      title: "Company Details",
      details: "Enter the company details",
      icon: (
        <IconBuildings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "special-instructions",
      title: "Special Instructions",
      details: "Enter the special instructions",
      icon: (
        <IconFloatLeft className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "data-sources",
      title: "Data Sources",
      details: "Enter the data sources",
      icon: (
        <IconDatabase className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "activation",
      title: "Activation",
      details: "Activate your chatbot",
      icon: (
        <IconChecks className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    }
   
  ];

  const [selectedId, setSelectedId] = useState<string>("chatbot-details");
  const CurrentForm = selectedId ? formComponents[selectedId] : null;

  return (
    
        <div className="container mx-auto max-w-6xl h-full">
        <div className="flex justify-between items-center mb-8 mt-8">
          <h1 className="text-3xl font-bold text-gray-800">Build a new Chatbot</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Want to edit an existing chatbot?</span>
            <Link href="/testchatbot" className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition-colors">
              My Chatbots
            </Link>
          </div>
        </div>
        <div className="relative">
          <BackgroundGradient animate={false} className="rounded-2xl min-h-[800px]">
            <div className="absolute inset-[0.5px] rounded-2xl bg-white">
              <div className="w-full h-full p-8 overflow-hidden">
              <div className="absolute top-4 right-4 z-50">
                {(() => {
                  const chatbotDetails = useChatbotStore().chatbotDetails;
                  const isValid = Boolean(chatbotDetails.name && 
                                          chatbotDetails.personality && 
                                          chatbotDetails.description);
                  return (
                    <ActivationDialog 
                      isValid={isValid}
                      isLoading={isLoading}
                    />
                  );
                })()}
              </div>
                <div className="relative w-full h-full overflow-y-auto">
                  <FloatingDock
                    items={items}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    desktopClassName="..."
                    mobileClassName="..."
                  />
                  <div className="w-full flex justify-center mt-10">
                    {selectedId && CurrentForm && <CurrentForm />}
                  </div>
                </div>
              </div>
            </div>
          </BackgroundGradient>
        </div>
      </div>
  );
};

export default CreateChatbotPage;

// import { fetchChatbots, Chatbot } from '../../../lib/chatbotsfetch';
// import CreateChatbotBasicDetails from '../../../components/create_chatbot_basic_details';
// import DocumentUpload from '../../../components/document_upload';
// import axios, { AxiosResponse } from 'axios';
   {/* Tab Buttons

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
        </div> */}

        {/* <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
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
              
              <DocumentUpload />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              
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
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-150"
            >
              {currentStep === 2 ? "Finish" : "Create"}
            </button>
          </div>
        </form> */}


        // const handleSubmit = (e: any) => {
        //   e.preventDefault();
        //   console.log("Form submitted");
        //   console.log(name, personality, companyName, role);
        //   const user = localStorage.getItem('user');
        //   const is_rag_enabled = false;
        //   const rag_source = "FAQ Database 1 and 2";
        //   const token = localStorage.getItem('accessToken');
        //   axios.post('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/', {
        //     chatbot_name: name,
        //     personality: personality,
        //     company_name: companyName,
        //     role: role,
        //     is_rag_enabled: is_rag_enabled,
        //     rag_source: rag_source,
        //     user: user
        //   }, {
        //     headers: {
        //       'Authorization': `Bearer ${token}`,
        //       'Content-Type': 'application/json'
        //     }
        //   })
        //   .then((response: AxiosResponse) => {
        //     console.log('Chatbot created successfully:', response.data);
        //     getChatbots();
        //   })
        //   .catch(error => {
        //     console.error('Error creating chatbot:', error);
        //   });
        //   setName('');
        //   setPersonality('');
        //   setCompanyName('');
        //   setRole('');
        //   alert('Chatbot created successfully');
        // };

          // const getChatbots = async () => {
  //   try {
  //     const chatbots = await fetchChatbots();
  //     setSavedChatbots(chatbots);
  //   } catch (error) {
  //     console.error('Error fetching chatbots:', error);
  //   }
  // };

  // useEffect(() => {
  //   getChatbots();
  // }, []);
  // const handleTabClick = (index: number) => {
  //   setCurrentStep(index);
  // };

    // const [name, setName] = useState('');
  // const [personality, setPersonality] = useState('');
  // const [companyName, setCompanyName] = useState('');
    // const [role, setRole] = useState('');
  // const [savedChatbots, setSavedChatbots] = useState<Chatbot[]>([]);
  // const [currentStep, setCurrentStep] = useState(0);
  // const [actions, setActions] = useState('');
  // const [dataSource, setDataSource] = useState('');