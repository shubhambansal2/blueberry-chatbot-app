import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Link, FileText } from 'lucide-react';
import { editChatbotStore } from '../../store/editChatbotStore';

export type FileData = {
  file: File | null;
  preview: string;
};

interface DataSourcesInputs {
  websites: Array<{ value: string }>;
}

export const DataSourcesForm = () => {
  // Get store data and update function separately
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

  // Watch for changes in the websites field and update the store
  const websites = watch('websites');
  React.useEffect(() => {
    updateDataSources({
      ...dataSources,
      websites
    });
  }, [websites]);

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

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = (dataSources.documents || []).filter((_, i) => i !== index);
    updateDataSources({
      ...dataSources,
      documents: updatedDocuments
    });
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
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-600 transition-colors p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
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
    </div>
  );
};