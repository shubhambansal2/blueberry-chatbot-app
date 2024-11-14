import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2 }from 'lucide-react';
import { editChatbotStore } from '../../store/editChatbotStore';

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

  const handleActivate = async () => {
    setIsLoading(true);
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
          role: chatbotDetails.description,
          personality: chatbotDetails.personality,
          user: user
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create chatbot');
      }
      // Reset the form before navigation
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
        <Button
          size="lg"
          onClick={handleActivate}
          disabled={isLoading}
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Your Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Chatbot Details Section */}
            <div>
              <h3 className="text-lg font-semibold">Chatbot Details</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {chatbotDetails.name}</p>
                <p><span className="font-medium">Description:</span> {chatbotDetails.description}</p>
                <p><span className="font-medium">Primary Language:</span> {chatbotDetails.primaryLanguage}</p>
                <p><span className="font-medium">Personality:</span> {chatbotDetails.personality}</p>
              </div>
            </div>

            {/* Company Information Section */}
            <div>
              <h3 className="text-lg font-semibold">Company Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Company:</span> {companyDetails.companyName}</p>
                <p><span className="font-medium">Industry:</span> {companyDetails.industry}</p>
                {companyDetails.companyDetails && (
                  <p><span className="font-medium">Additional Details:</span> {companyDetails.companyDetails}</p>
                )}
              </div>
            </div>

            {/* Special Instructions Section */}
            <div>
              <h3 className="text-lg font-semibold">Special Instructions</h3>
              <p className="mt-2">{specialInstructions.specialinstructions}</p>
              {specialInstructions.exampleresponses?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium">Example Responses:</h4>
                  <ul className="mt-2 space-y-2">
                    {specialInstructions.exampleresponses.map((example, index) => (
                      <li key={index} className="ml-4">
                        <p><span className="font-medium">Q:</span> {example.question}</p>
                        <p><span className="font-medium">A:</span> {example.answer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Data Sources Section */}
            <div>
              <h3 className="text-lg font-semibold">Data Sources</h3>
              
              {/* Websites Section */}
              {dataSources?.websites && dataSources.websites.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Websites:</h4>
                  <ul className="mt-1 list-disc list-inside">
                    {dataSources.websites.map((site, index) => {
                      console.log('Rendering website:', site); // Debug log for each website
                      return (
                        <li key={index} className="text-sm break-all">
                          {typeof site === 'string' ? site : site?.value}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              {/* Documents Section */}
              {documentsList.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Documents:</h4>
                  <ul className="mt-1 list-disc list-inside">
                    {documentsList.map((document, index) => (
                      <li key={index} className="text-sm break-all">
                        {document}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* No Data Sources Message */}
              {(!dataSources?.websites?.length && !documentsList.length) && (
                <p className="text-sm text-gray-500 mt-2">No data sources added</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivationForm;