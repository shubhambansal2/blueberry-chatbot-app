import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2 }from 'lucide-react';
import { useChatbotStore } from '../../store/useChatbotStore';

const ActivationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    agentType,
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


  const handleActivate = async () => {
    setIsLoading(true);
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
          is_product_recommender: agentType.isSalesAgent,
          chatbot_name: chatbotDetails.name,
          company_name: companyDetails.companyName,
          company_industry: companyDetails.industry || "",
          company_details: companyDetails.companyDetails || "",
          special_instructions: specialInstructions.specialinstructions || "",
          question_answer_pairs: specialInstructions.exampleresponses || [],
          integration_id: dataSources.selectedIntegration?.id || "",
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
      // Reset the form before navigation
      resetForm();
      router.push(`/testchatbot/`);
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
            <p className="text-gray-500 text-sm mt-2 text-center mx-auto">
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