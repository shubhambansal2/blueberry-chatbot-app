'use client'
import React, { useState, useEffect } from 'react';
import { FloatingDock } from "@components/ui/Floating_dock";
import { BackgroundGradient } from '@components/ui/background_gradient';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { editChatbotStore } from '../../../../store/editChatbotStore';
import ActivationDialog from '@components/ActivationDialogue';
import { CompanyDetailsForm } from '@components/edit forms/CompanyDetailsForm';
import { DataSourcesForm, FileData } from '@components/edit forms/DataSourcesForm';
import { ChatbotDetailsForm } from '@components/edit forms/ChatbotDetailsForm';
import { SpecialInstructionsForm } from '@components/edit forms/SpecialInstructionsForm';
import ActivationForm from '@components/edit forms/ActivationForm';
import { useBrowserNavigationGuard } from '../../../../lib/useNavigationGuard';
import LeaveDialog from '@components/EditbotDialogue';
import ActivationDialogue_Edit from '@components/ActivationDialogue_Edit';
import ChatbotTypeForm from '@components/edit forms/ChatbotType';

import {
  IconMessageChatbot,
  IconBuildings,
  IconFloatLeft,
  IconDatabase,
  IconChecks,
} from "@tabler/icons-react";

// Define the type for data source
type DataSource = {
  title: string;
  url: string;
  source_id?: string;
  id?: string;
  // Add other properties if needed
};

interface DataSources {
  websites: Array<{ value: string, source_id?: string }>;  // Updated to match FieldArray requirements
  documents: FileData[];
}
const fetchDataSources = async (id: string) => {
  // Make API call to get data sources
  const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_data_sources/${id}/`, {
  });
  return response.json();
}

// Mock API call to fetch chatbot data
const fetchChatbotData = async (id: string) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  const dataSources = await fetchDataSources(id);
  const pdfs = dataSources.data_sources.filter((source: DataSource) => source.title.endsWith('.pdf'));  
  const urls = dataSources.data_sources.filter((source: DataSource) => source.title.startsWith('http') || source.title.startsWith('www'));

  const pdffile = await Promise.all(pdfs.map(async (pdf: DataSource) => {
    const pdfUrl = pdf.url;
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    return {
      url: pdfUrl,
      data: blob,
      id: pdf.id  // Store the source_id from the PDF
    };
  }));

  dataSources.data_sources = [...urls, ...pdffile];
  console.log(urls);
  console.log(pdffile);
  
  const chatbotData = await response.json();
  
  // Fetch integration information if integration_id exists
  let selectedIntegration = null;
  if (chatbotData.integration_id) {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const integrationResponse = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_dataintegrations/${user}/`);
        const integrationData = await integrationResponse.json();
        
        if (integrationResponse.ok && integrationData.dataintegrations?.length > 0) {
          const integration = integrationData.dataintegrations.find((int: any) => int.id === chatbotData.integration_id);
          if (integration) {
            selectedIntegration = {
              id: integration.id,
              shop: integration.shop,
              platform: 'Shopify', // Assuming all integrations are Shopify
              created_at: integration.created_at || new Date().toISOString()
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching integration:', error);
    }
  }
  
  return {
    agentType: chatbotData.is_product_recommender ? 'sales' : 'support',
    companyDetails: {
      companyName: chatbotData.company_name,
      industry: chatbotData.company_industry,
      companyDetails: chatbotData.company_details,
      logo: null,
    },
    chatbotDetails: {
      name: chatbotData.chatbot_name,
      personality: chatbotData.personality,
      description: chatbotData.role,
      primaryLanguage: 'English',
      color: { id: '1', value: '#0000FF', name: 'Blue' },
      avatar: null,
    },
    specialInstructions: {
      specialinstructions: chatbotData.special_instructions,
      exampleresponses: chatbotData.question_answer_pairs,
    },
    dataSources: {
      websites: urls.map((url: DataSource) => ({ 
        value: url.title,
        source_id: url.id  // Store the source_id from the URL
      })),
      documents: pdffile.map(pdf => ({
        file: new File([pdf.data], pdf.url.split('/').pop() || 'document.pdf', { type: 'application/pdf' }),
        preview: pdf.url,
        source_id: pdf.id  // Include the source_id in documents
      })),
      selectedIntegration: selectedIntegration
    }
  };
};

// Mock API call to update chatbot
const updateChatbot = async (id: string, data: any) => {
  const state = editChatbotStore.getState();
  const payload = {
    ...data,
    agentType: state.agentType,
    selectedIntegration: state.dataSources.selectedIntegration,
    // include other fields as needed
  };
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Replace with actual API call:
  // await fetch(`/api/chatbots/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  return { success: true };
};

const formComponents: Record<string, React.FC> = {
  'agent_type': ChatbotTypeForm,
  'company-details': CompanyDetailsForm,
  'data-sources': DataSourcesForm,
  'chatbot-details': ChatbotDetailsForm,
  'special-instructions': SpecialInstructionsForm,
  'activation': ActivationForm,
};

const EditChatbotPage = () => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = ''; // Standard way to show a prompt in modern browsers
            }
        };

        const handlePopState = () => {
            if (hasUnsavedChanges) {
                const confirmLeave = window.confirm(
                    "You have unsaved changes. Do you want to leave without saving?"
                );
                if (confirmLeave) {
                    resetForm();
                } else {
                    // Prevent navigation by pushing the current state back
                    window.history.pushState(null, '', window.location.pathname);
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [hasUnsavedChanges]);

    

    const resetForm = () => {
        updateCompanyDetails({
          companyName: '',
          industry: '',
          companyDetails: '',
          logo: null,
        });
        updateChatbotDetails({
          name: '',
          personality: '',
          description: '',
          primaryLanguage: '',
          color: null,
          avatar: null,
        });
        updateSpecialInstructions({
          specialinstructions: '',
          exampleresponses: [],
        });
        updateDataSources({
          websites: [],
          documents: [],
        });
        updateActivation({
          isActive: false,
          startDate: '',
          endDate: '',
          allowedDomains: [],
        });
        setHasUnsavedChanges(false);
      };
 
//   useBrowserNavigationGuard(hasUnsavedChanges, resetForm);

 
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
  } = editChatbotStore();

  
  
  const [error, setError] = useState<string | null>(null);

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
        // AGENT TYPE
        if (data.agentType === 'sales') {
          editChatbotStore.getState().updateAgentType({ isSalesAgent: true, isSupportAgent: false });
        } else {
          editChatbotStore.getState().updateAgentType({ isSalesAgent: false, isSupportAgent: true });
        }
        updateCompanyDetails(data.companyDetails);
        updateChatbotDetails(data.chatbotDetails);
        updateSpecialInstructions(data.specialInstructions);
        updateDataSources(data.dataSources);
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
      id: "agent_type",
      title: "Agent Functionality",
      details: "Select the type of agent you want to build",
      icon: (
        <IconDatabase className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#agent_type",
    },
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
  const chatbotDetails = editChatbotStore((state) => state.chatbotDetails);

  const isValid = Boolean(
    chatbotDetails.name && 
    chatbotDetails.personality && 
    chatbotDetails.description
  );
  
  

  const [selectedId, setSelectedId] = useState<string>("agent_type");
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
    <div className="container mx-auto max-w-6xl h-full px-4 md:px-6 my-4 ">
      <div className="flex justify-between items-center mb-6 md:mb-8 mt-6 md:mt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 hidden md:block">Edit an existing Chatbot</h1>
        <div className="items-center ">
          <LeaveDialog 
            onReset={resetForm}
          />
        </div>
      </div>
      
      <div className="relative">
      <BackgroundGradient animate={false} className="rounded-2xl min-h-[700px] md:min-h-[800px] p-4 md:p-10">
          <div className="absolute inset-[0.5px] rounded-2xl bg-white overflow-hidden">
            <div className="w-full h-full p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="absolute top-4 right-4 z-50 hidden md:block">
                {selectedId !== 'activation' && (
                  <ActivationDialogue_Edit 
                    isValid={isValid}
                    isLoading={isSaving}
                  />
                )}
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

export default EditChatbotPage;