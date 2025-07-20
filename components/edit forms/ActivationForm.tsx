import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2 }from 'lucide-react';
import { editChatbotStore } from '../../store/editChatbotStore';

// Define a type for URLs
type URLType = string | { value: string; source_id?: string };
type DocumentType = File & { source_id?: string };

const ActivationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    chatbotDetails,
    companyDetails,
    specialInstructions,
    dataSources,
    resetForm
  } = editChatbotStore();

  // Debug logs
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

  const handleActivate = async () => {  
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const chatbot_id = window.location.pathname.split('/').pop();
      // Get agentType and selectedIntegration from store
      const { agentType, dataSources } = editChatbotStore.getState();
      const selectedIntegration = dataSources.selectedIntegration;
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
          is_product_recommender: agentType.isSalesAgent,
          integration_id: selectedIntegration?.id || "",
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
    } finally {
      setIsLoading(false);
    }
  };

  // Safely get documents
  const documentsList = dataSources?.documents
    ?.filter(d => d?.file?.name)
    .map(d => d.file?.name)
    .filter(Boolean) ?? [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
    <div className="flex justify-center">
      <div>
        <Button
          size="lg"
          onClick={handleActivate}
          disabled={isLoading || !chatbotDetails.name || !chatbotDetails.description || !chatbotDetails.personality}
          className="w-full max-w-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Activating Chatbot...
            </>
          ) : (
            'Activate Chatbot'
          )}
        </Button>
        {(!chatbotDetails.name || !chatbotDetails.description || !chatbotDetails.personality) && (
          <p className="text-red-500 text-sm mt-2 text-center">
            Please fill in all mandatory fields (Name, Description and Personality)
          </p>
        )}
      </div>
    </div>

    <div className="border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Review Your Chatbot</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Chatbot Details */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Chatbot Details</h3>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex">
                <dt className="w-32 font-medium">Name:</dt>
                <dd>{chatbotDetails.name}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 font-medium">Description:</dt>
                <dd>{chatbotDetails.description}</dd>
              </div>
        
              <div className="flex">
                <dt className="w-32 font-medium">Personality:</dt>
                <dd>{chatbotDetails.personality}</dd>
              </div>
            </dl>
          </div>

          {/* Special Instructions */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Special Instructions</h3>
            <p className="mt-2 text-sm">{specialInstructions.specialinstructions}</p>
            {specialInstructions.exampleresponses?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-sm">Example Responses:</h4>
                <div className="mt-1 space-y-2 text-sm">
                  {specialInstructions.exampleresponses.map((example, index) => (
                    <div key={index} className="pl-2 border-l-2">
                      <p className="font-medium">Q: {example.question}</p>
                      <p>A: {example.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex">
                <dt className="w-32 font-medium">Company:</dt>
                <dd>{companyDetails.companyName}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 font-medium">Industry:</dt>
                <dd>{companyDetails.industry}</dd>
              </div>
              {companyDetails.companyDetails && (
                <div className="flex">
                  <dt className="w-32 font-medium">Details:</dt>
                  <dd>{companyDetails.companyDetails}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2">Data Sources</h3>
            {dataSources?.websites && dataSources.websites.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium text-sm">Websites:</h4>
                <ul className="mt-1 text-sm space-y-1">
                  {dataSources.websites.map((site, index) => (
                    <li key={index} className="truncate">
                      {typeof site === 'string' ? site : site?.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {documentsList.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium text-sm">Documents:</h4>
                <ul className="mt-1 text-sm space-y-1">
                  {documentsList.map((document, index) => (
                    <li key={index} className="truncate">{document}</li>
                  ))}
                </ul>
              </div>
            )}

            {dataSources.selectedIntegration && (
                            <div className="mt-2">
                              <h4 className="font-medium text-sm">Data Integration:</h4>
                              <p className="mt-1 text-sm">{dataSources.selectedIntegration.shop}</p>
                            </div>
                          ) }
            
            {(!dataSources?.websites?.length && !documentsList.length && !dataSources.selectedIntegration) && (
              <p className="text-sm text-gray-500 mt-2">No data sources added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ActivationForm;