'use client'
import React, { useState, useEffect } from 'react';
import { FloatingDock } from "@components/ui/Floating_dock";
import { BackgroundGradient } from '@components/ui/background_gradient';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useChatbotStore } from '../../../../store/useChatbotStore';
import ActivationDialog from '@components/ActivationDialogue';
import { CompanyDetailsForm } from '@components/forms/CompanyDetailsForm';
import { DataSourcesForm } from '@components/forms/DataSourcesForm';
import { ChatbotDetailsForm } from '@components/forms/ChatbotDetailsForm';
import { SpecialInstructionsForm } from '@components/forms/SpecialInstructionsForm';
import ActivationForm from '@components/forms/ActivationForm';
import { useNavigationGuard } from '../../../../lib/useNavigationGuard';
import LeaveDialog from '@components/EditbotDialogue';

import {
  IconMessageChatbot,
  IconBuildings,
  IconFloatLeft,
  IconDatabase,
  IconChecks,
} from "@tabler/icons-react";

// Mock API call to fetch chatbot data
const fetchChatbotData = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Fetching chatbot data for ID:", id);

  return {
    companyDetails: {
      companyName: 'Example Corp',
      industry: 'Technology',
      companyDetails: 'A leading technology company',
      logo: null,
    },
    chatbotDetails: {
      name: 'Tech Support Bot',
      personality: 'Professional and helpful',
      description: 'Assists with technical support queries',
      primaryLanguage: 'English',
      color: { id: '1', value: '#0000FF', name: 'Blue' },
      avatar: null,
    },
    specialInstructions: {
      specialinstructions: 'Focus on technical support queries',
      exampleresponses: [
        { question: 'How do I reset my password?', answer: 'Click on forgot password link...' }
      ],
    },
    dataSources: {
      websites: [{ value: 'https://example.com/docs' }],
      documents: [],
    },
    activation: {
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      allowedDomains: ['example.com'],
    },
    deployment: {
      platform: 'web',
      configuration: {},
      customCSS: '',
      customScripts: [],
    },
  };
};

// Mock API call to update chatbot
const updateChatbot = async (id: string, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true };
};

const formComponents: Record<string, React.FC> = {
  'company-details': CompanyDetailsForm,
  'data-sources': DataSourcesForm,
  'chatbot-details': ChatbotDetailsForm,
  'special-instructions': SpecialInstructionsForm,
  'activation': ActivationForm,
};

const EditChatbotPage = () => {
 
 
  const router = useRouter();
  const params = useParams();
  const chatbotId = params.id as string;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const {
    updateCompanyDetails,
    updateChatbotDetails,
    updateSpecialInstructions,
    updateDataSources,
    updateActivation,
    updateDeployment,
  } = useChatbotStore();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  const { showLeaveDialog, onConfirmLeave, onCancelLeave } = useNavigationGuard({
    hasUnsavedChanges,
    onNavigate: (path) => router.push(path)
  });


  useEffect(() => {
    const loadChatbotData = async () => {
      try {
        // Access params here instead of calling useParams()
        const chatbotId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        
        if (!chatbotId) {
          setError('No chatbot ID provided');
          return;
        }

        // Fetch mock data
        const data = await fetchChatbotData(chatbotId);

        // Update store with mock data
        updateCompanyDetails(data.companyDetails);
        updateChatbotDetails(data.chatbotDetails);
        updateSpecialInstructions(data.specialInstructions);
        updateDataSources(data.dataSources);
        updateActivation(data.activation);
        updateDeployment(data.deployment);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    loadChatbotData();
  }, [params.slug, updateCompanyDetails, updateChatbotDetails, updateSpecialInstructions, updateDataSources, updateActivation, updateDeployment]); 

  const items = [
    {
      id: "chatbot-details",
      title: "Chatbot Details", 
      details: "Update the chatbot details",
      icon: (
        <IconMessageChatbot className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#chatbot-details",
    },
    {
      id: "company-details",
      title: "Company Details",
      details: "Update the company details",
      icon: (
        <IconBuildings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#company-details",
    },
    {
      id: "special-instructions",
      title: "Special Instructions",
      details: "Update the special instructions",
      icon: (
        <IconFloatLeft className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#special-instructions",
    },
    {
      id: "data-sources",
      title: "Data Sources",
      details: "Update the data sources",
      icon: (
        <IconDatabase className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#data-sources",
    },
    {
      id: "activation",
      title: "Activation",
      details: "Update activation settings",
      icon: (
        <IconChecks className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#activation",
    }
  ];

  const [selectedId, setSelectedId] = useState<string>("chatbot-details");
  const CurrentForm = selectedId ? formComponents[selectedId] : null;

  



  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl h-full">
      <div className="flex justify-between items-center mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit an existing Chatbot</h1>
        {/* <button
          onClick={onConfirmLeave}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Leave Page
        </button> */}
      </div>
      
      <div className="relative">
        <BackgroundGradient animate={false} className="rounded-2xl min-h-[800px]">
          <div className="absolute inset-[0.5px] rounded-2xl bg-white">
            <div className="w-full h-full p-8 overflow-hidden">
              <div className="absolute top-4 right-4 z-50">
                <ActivationDialog 
                  isValid={true}
                  isLoading={isSaving}
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

      {showLeaveDialog && (
        <LeaveDialog
          onConfirm={onConfirmLeave}
          onCancel={onCancelLeave}
        />
      )}
    </div>
  );
};

export default EditChatbotPage;