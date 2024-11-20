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
} from "./ui/alert-dialog"
import { editChatbotStore } from '../store/editChatbotStore';

type URLType = string | { value: string; source_id?: string };
type DocumentType = File & { source_id?: string };

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
  } = editChatbotStore(); 

  const handleActivation = async () => {
    setIsActivating(true);
    setIsOpen(false);

    console.log('Full Data Sources:', dataSources);
  console.log('Websites array:', dataSources?.websites);

  const uploadDocuments = async (chatbot_id: string, documents: DocumentType[], urls: URLType[]) => {
    console.log('Uploading documents for chatbot:', chatbot_id);
    console.log('Documents:', documents);
    
    // Create FormData for each document
    const formData = new FormData();
    
    // Upload each document that doesn't have a source_id
    for (const document of documents) {
      // Skip if document already has a source_id (meaning it's already uploaded)
      if ((document as DocumentType).source_id) {
        console.log(`Skipping document ${document.name} as it already has a source_id`);
        continue;
      }

      formData.append('pdf_file', document);
      formData.append('title', document.name);
      formData.append('chatbot_id', chatbot_id);

      console.log(formData);

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
    // Upload each URL that doesn't have a source_id
    for (const url of urls) {
      // Skip if URL already has a source_id
      if (typeof url === 'object' && url.source_id) {
        console.log(`Skipping URL ${url.value} as it already has a source_id`);
        continue;
      }

      const urlFormData = new FormData();
      const urlValue = typeof url === 'string' ? url : url.value;
      urlFormData.append('url', urlValue);
      urlFormData.append('chatbot_id', chatbot_id);
      urlFormData.append('title', urlValue);

      try {
        const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/upload-url/', {
          method: 'POST',
          body: urlFormData
        });

        if (!response.ok) {
          throw new Error(`Failed to upload URL ${urlValue}`);
        }

        const result = await response.json();
        console.log(`Successfully uploaded URL ${urlValue}:`, result);
      } catch (error) {
        console.error(`Error uploading URL ${urlValue}:`, error);
      }
    }
  }
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const chatbot_id = window.location.pathname.split('/').pop();
      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/${chatbot_id}/`, {
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

      const files = dataSources?.documents
                    ?.map(d => {
                      if (d.file) {
                        // Create a new File object with the same properties and add source_id
                        const file = new File([d.file], d.file.name, {
                          type: d.file.type,
                          lastModified: d.file.lastModified
                        });
                        Object.defineProperty(file, 'source_id', {
                          value: d.source_id,
                          enumerable: true
                        });
                        return file;
                      }
                      return null;
                    })
                    .filter((file): file is (File & { source_id: string | undefined }) => file !== null) ?? [];
      const websiteUrls = dataSources?.websites?.map(site => typeof site === 'string' ? site : site) ?? [];
      
      if (chatbot_id) {
        await uploadDocuments(chatbot_id, files, websiteUrls);
      }
      
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
            <span>{externalLoading ? 'Activating...' : 'One-Click Save & Activate'}</span>
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