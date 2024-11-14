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
                <ActivationDialog 
                  isValid={isValid}
                  isLoading={isLoading}
                />
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