'use client'
import React, { useState } from 'react';
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
import ActivationForm from '../../../components/forms/ActivationForm';

import {
  IconMessageChatbot,
  IconBuildings,
  IconFloatLeft,
  IconDatabase,
  IconChecks,
} from "@tabler/icons-react";

const formComponents: Record<string, React.FC> = {
  'company-details': CompanyDetailsForm,
  'data-sources': DataSourcesForm,
  'chatbot-details': ChatbotDetailsForm,
  'special-instructions': SpecialInstructionsForm,
  'activation': ActivationForm
};

const CreateChatbotPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("chatbot-details");
  
  // Move the hook outside of any callbacks and use it directly in the component
  const chatbotDetails = useChatbotStore((state) => state.chatbotDetails);

  // Calculate isValid using the chatbotDetails
  const isValid = Boolean(
    chatbotDetails.name && 
    chatbotDetails.personality && 
    chatbotDetails.description
  );

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

  const CurrentForm = selectedId ? formComponents[selectedId] : null;
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-6xl min-h-screen px-4 md:px-6 my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-8 gap-4 md:gap-2 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Build a new Chatbot</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-2 w-full md:w-auto">
          <span className="text-sm text-gray-500 hidden md:inline">Want to edit an existing chatbot?</span>
          <div className="flex flex-row gap-2 w-full md:w-auto">
            <Link href="/testchatbot" className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base">
              My Chatbots
            </Link>
            <button
              onClick={() => {
                useChatbotStore.getState().resetForm();
                console.log("Form reset");
                window.location.reload();
              }}
              className="flex-1 md:flex-none text-center px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors text-sm md:text-base"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        <BackgroundGradient animate={false} className="rounded-2xl min-h-[800px] md:min-h-[900px] p-4 md:p-10">
          <div className="absolute inset-[0.5px] rounded-2xl bg-white overflow-hidden">
            <div className="w-full h-full p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="absolute top-4 right-4 z-50 hidden md:block">
                {selectedId !== "activation" && (
                  <ActivationDialog 
                    isValid={isValid}
                    isLoading={isLoading}
                  />
                )}
              </div>
              <div className="relative w-full h-full">
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