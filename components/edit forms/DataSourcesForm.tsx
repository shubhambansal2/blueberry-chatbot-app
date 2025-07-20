import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Link, FileText, Lock } from 'lucide-react';
import { editChatbotStore, Integration } from '../../store/editChatbotStore';
import { toast } from '@components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/Card";

export type FileData = {
  file: File | null;
  preview: string;
  source_id?: string;
};

interface DataSourcesInputs {
  websites: Array<{ value: string, source_id?: string }>;
}

export const DataSourcesForm = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const dataSources = editChatbotStore(state => state.dataSources);
  const updateDataSources = editChatbotStore(state => state.updateDataSources);

  const { register, control, formState: { errors }, watch } = useForm<DataSourcesInputs>({
    defaultValues: {
      websites: dataSources.websites || [{ value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'websites'
  });

  const websites = watch('websites');
  React.useEffect(() => {
    updateDataSources({
      ...dataSources,
      websites
    });
  }, [websites]);

  useEffect(() => {
    checkExistingIntegrations();
    // Check if we're in edit mode by looking for existing integration
    if (dataSources.selectedIntegration) {
      setIsEditMode(true);
      setSelectedIntegration(dataSources.selectedIntegration);
    }
  }, []);

  // Fetch integrations on component mount
  const checkExistingIntegrations = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        setLoading(false);
        return;
      }

      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/get_dataintegrations/${user}/`);
      const data = await response.json();

      if (response.ok && data.dataintegrations?.length > 0) {
        // Transform the data to include platform information
        const transformedIntegrations: Integration[] = data.dataintegrations.map((integration: any) => ({
          id: integration.id || Math.random().toString(),
          shop: integration.shop,
          platform: 'Shopify', // For now, assuming all integrations are Shopify
          created_at: integration.created_at || new Date().toISOString()
        }));
        
        setIntegrations(transformedIntegrations);
        
        // Set the integration as selected if there's a stored selection
        if (dataSources.selectedIntegration) {
          const matchedIntegration = transformedIntegrations.find(int => int.id === dataSources.selectedIntegration?.id);
          if (matchedIntegration) {
            setSelectedIntegration(matchedIntegration);
            setIsEditMode(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking integrations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check existing integrations. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationSelect = (integration: Integration) => {
    // Only allow selection if not in edit mode
    if (!isEditMode) {
      setSelectedIntegration(integration);
    }
  };
  
  // Update store when integration is selected
  useEffect(() => {
    updateDataSources({
      ...dataSources,
      selectedIntegration
    });
  }, [selectedIntegration]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);
    const newFiles: FileData[] = [];

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        newFiles.push({ file, preview });
        
        if (newFiles.length === fileArray.length) {
          const currentDocuments = dataSources.documents || [];
          updateDataSources({
            ...dataSources,
            documents: [...currentDocuments, ...newFiles]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDocument = async (index: number) => {
    // Log the source_id before removing the document
    const documentToRemove = dataSources.documents?.[index];
    console.log(documentToRemove);
    if (documentToRemove?.source_id) {
      console.log('Deleting document with source_id:', documentToRemove.source_id);
      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/delete-pdf/${documentToRemove.source_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
    }

    const updatedDocuments = (dataSources.documents || []).filter((_, i) => i !== index);
    updateDataSources({
      ...dataSources,
      documents: updatedDocuments
    });
  };

  const handleRemoveWebsite = async (index: number) => {
    // Log the source_id before removing the website
    const websiteToRemove = websites[index];
    console.log(websiteToRemove);
    if (websiteToRemove?.source_id) {
      console.log('Deleting website with source_id:', websiteToRemove.source_id);
      const response = await fetch(`https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/delete-url/${websiteToRemove.source_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
    }
    
    remove(index);
  };

  return (
    <div className="space-y-8 w-full max-w-2xl">
      {/* Websites Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Website Links</label>
          <button
            type="button"
            onClick={() => append({ value: '' })}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Website
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <div className="flex-grow">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter website URL"
                    {...register(`websites.${index}.value`)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveWebsite(index)}
                className="text-red-500 hover:text-red-600 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
     

      {/* Documents Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">PDF Documents</label>
        
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
          <input
            type="file"
            id="documents"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="documents"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <FileText className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              Drop PDF files here or click to upload
            </span>
            <span className="text-xs text-gray-400">
              Maximum file size: 10MB
            </span>
          </label>
        </div>

        {/* Document Previews */}
        {dataSources.documents?.length > 0 && (
          <div className="space-y-3">
            {dataSources.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm truncate max-w-xs">
                    {doc.file?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Integrations Section */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Data Integrations</label>
          {isEditMode && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Lock className="w-4 h-4" />
              <span>Integration locked</span>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <div className="text-sm text-gray-600">Loading integrations...</div>
          </div>
        ) : integrations.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Integrations</CardTitle>
              <CardDescription>
                {isEditMode 
                  ? "Your chatbot's current data integration (cannot be changed)"
                  : "Select a data source to use for your chatbot"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedIntegration?.id === integration.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    } ${
                      !isEditMode ? 'cursor-pointer hover:border-gray-300' : 'cursor-not-allowed'
                    }`}
                    onClick={() => handleIntegrationSelect(integration)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">S</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.shop}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{integration.platform}</span>
                            <span>•</span>
                            <span>Connected</span>
                            {isEditMode && selectedIntegration?.id === integration.id && (
                              <>
                                <span>•</span>
                                <span className="text-amber-600 font-medium">Current</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedIntegration?.id === integration.id && (
                        <div className="flex items-center gap-2">
                          {isEditMode && (
                            <Lock className="w-4 h-4 text-amber-600" />
                          )}
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <div className="text-sm text-gray-600">
              No integrations found. Connect your data sources to get started.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};