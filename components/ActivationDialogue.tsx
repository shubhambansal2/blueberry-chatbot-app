'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { useChatbotStore } from '../store/useChatbotStore';

type ActivationDialogProps = {
  isValid: boolean;
  isLoading: boolean;
};

const ActivationDialog = ({ isValid, isLoading: externalLoading }: ActivationDialogProps) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    chatbotDetails,
    companyDetails,
    specialInstructions,
    dataSources,
    resetForm
  } = useChatbotStore();

  // Debug logs
  console.log('Full Data Sources:', dataSources);
  console.log('Websites array:', dataSources?.websites);

  const uploadDocuments = async (chatbotId: string, documents: File[], urls: string[]) => {
    console.log('Uploading documents for chatbot:', chatbotId);
    console.log('Documents:', documents);
    // Create FormData for each document
    const formData = new FormData();
    
    // Upload each document
    for (const document of documents) {
      formData.append('pdf_file', document);
      formData.append('title', document.name);
      formData.append('chatbot_id', chatbotId);

      try {
        const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/pdfupload/', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Failed to upload document ${document.name}`);
        }

        const result = await response.json();
        console.log(`Successfully uploaded document ${document.name}:`, result);
      } catch (error) {
        console.error(`Error uploading document ${document.name}:`, error);
      }
    }
    console.log('URLs:', urls);
    // Upload each URL
    for (const url of urls) {
      const urlFormData = new FormData();
      urlFormData.append('url', url);
      urlFormData.append('chatbot_id', chatbotId);
      urlFormData.append('title', url);

      try {
        const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/upload-url/', {
          method: 'POST',
          body: urlFormData
        });

        if (!response.ok) {
          throw new Error(`Failed to upload URL ${url}`);
        }

        const result = await response.json();
        console.log(`Successfully uploaded URL ${url}:`, result);
      } catch (error) {
        console.error(`Error uploading URL ${url}:`, error);
      }
    }
  }

  const handleActivation = async () => {
    setIsActivating(true);
    setIsOpen(false);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          chatbot_name: chatbotDetails.name,
          company_name: companyDetails.companyName,
          company_industry: companyDetails.industry || "",
          company_details: companyDetails.companyDetails || "",
          special_instructions: specialInstructions.specialinstructions || "",
          question_answer_pairs: specialInstructions.exampleresponses || [],
          role: chatbotDetails.description || "",
          personality: chatbotDetails.personality || "",
          user: user,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create chatbot');
      }
      const data = await response.json();
      console.log('Chatbot created successfully:', data);
      const chatbotId = data.chatbot_id;
      console.log('New chatbot ID:', chatbotId);
      
      const files = dataSources?.documents?.map(d => d.file).filter((file): file is File => file !== null) ?? [];
      const websiteUrls = dataSources?.websites?.map(site => typeof site === 'string' ? site : site.value) ?? [];
      await uploadDocuments(chatbotId, files, websiteUrls);
      
      resetForm();
      router.push('/testchatbot');
    } catch (error) {
      console.error('Error activating chatbot:', error);
      setIsActivating(false);
    }
  };

  return (
    <>
      {isActivating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
            <span className="text-gray-900">Creating your chatbot...</span>
          </div>
        </div>
      )}
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <button 
            disabled={!isValid || externalLoading || isActivating}
            className={`px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center space-x-2 ${
              isValid && !isActivating
                ? 'bg-blue-900 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={() => !isActivating && setIsOpen(true)}
          >
            {externalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{externalLoading ? 'Activating...' : 'One-Click Activation'}</span>
          </button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Confirm Chatbot Activation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to activate your chatbot with these details?
              </p>
              <p className="text-sm text-gray-500">
                Click &apos;Continue&apos; to activate with these details, or &apos;Edit Details&apos; to make changes.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-100 hover:bg-gray-200"
            >
              Edit Details
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivation}
              className="bg-blue-900 hover:bg-blue-700 text-white"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActivationDialog;