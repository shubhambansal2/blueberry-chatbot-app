import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Link, FileText } from 'lucide-react';
import { debounce } from 'lodash';

export type FileData = {
  file: File | null;
  preview: string;
};

interface DataSourcesInputs {
  websites: Array<{ value: string }>;
  documents: FileData[];
}

export const DataSourcesForm = () => {
  const { dataSources, updateDataSources } = { 
    dataSources: { websites: [], documents: [] }, 
    updateDataSources: (data: any) => console.log('Update data sources:', data) 
  };
  const [documentPreviews, setDocumentPreviews] = useState<FileData[]>(
    dataSources.documents || []
  );

  const {
    register,
    control,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<DataSourcesInputs>({
    defaultValues: {
      websites: [{ value: '' }],
      documents: [],
    },
  });

  const {
    fields: websiteFields,
    append: appendWebsite,
    remove: removeWebsite,
  } = useFieldArray({
    control,
    name: 'websites',
  });

  // Watch website fields
  const watchedFields = watch();

  // URL validation regex
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  // Debounced update function
  const debouncedUpdate = debounce((data: DataSourcesInputs) => {
    updateDataSources({
      websites: data.websites,
      documents: data.documents,
    });
  }, 500);

  // Update store when website values change
  useEffect(() => {
    debouncedUpdate({
      websites: watchedFields.websites,
      documents: documentPreviews,
    });

    return () => {
      debouncedUpdate.cancel();
    };
  }, [watchedFields.websites, documentPreviews]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: FileData[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach(file => {
      if (file.type !== 'application/pdf') {
        setError('documents', {
          type: 'manual',
          message: 'Only PDF files are allowed',
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('documents', {
          type: 'manual',
          message: 'File size should not exceed 10MB',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        newFiles.push({ file, preview });
        
        setDocumentPreviews(prev => {
          const updated = [...prev, ...newFiles];
          debouncedUpdate({ 
            websites: watchedFields.websites,
            documents: updated 
          });
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    clearErrors('documents');
  };

  const handleRemoveDocument = (index: number) => {
    setDocumentPreviews(prev => {
      const updated = prev.filter((_, i) => i !== index);
      debouncedUpdate({ 
        websites: watchedFields.websites,
        documents: updated 
      });
      return updated;
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
            onClick={() => appendWebsite({ value: '' })}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Website
          </button>
        </div>

        <div className="space-y-3">
          {websiteFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <div className="flex-grow">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter website URL"
                    {...register(`websites.${index}.value`, {
                      pattern: {
                        value: urlPattern,
                        message: 'Please enter a valid URL',
                      },
                    })}
                  />
                </div>
                {errors.websites?.[index]?.value && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.websites[index]?.value?.message}
                  </p>
                )}
              </div>
              {websiteFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWebsite(index)}
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

        {errors.documents && (
          <p className="text-sm text-red-500">{errors.documents.message}</p>
        )}

        {/* Document Previews */}
        {documentPreviews.length > 0 && (
          <div className="space-y-3">
            {documentPreviews.map((doc, index) => (
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