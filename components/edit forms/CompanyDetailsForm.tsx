import { useForm } from 'react-hook-form';
import { editChatbotStore } from '../../store/editChatbotStore';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import  ImageUpload from '../ImageUpload';

interface CompanyDetailsInputs {
  companyName: string;
  industry: string;
  website: string;
  logo: FileList;
  companyDetails: string;
}

export const CompanyDetailsForm = () => {
  const { companyDetails, updateCompanyDetails } = editChatbotStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(
    companyDetails.logo?.preview || null
  );

  const { 
    register,
    watch,
    formState: { errors },
  } = useForm<CompanyDetailsInputs>({
    defaultValues: {
      companyName: companyDetails.companyName,
      industry: companyDetails.industry,
      companyDetails: companyDetails.companyDetails,
    },
  });

  // Watch all form fields
  const watchedFields = watch();

  // Debounced update function
  const debouncedUpdate = debounce((data: Partial<CompanyDetailsInputs>) => {
    const formData = {
      companyName: data.companyName,
      industry: data.industry,
      website: data.website,
      companyDetails: data.companyDetails,
    };
    updateCompanyDetails(formData);
  }, 500);

  // Update store when form values change
  useEffect(() => {
    debouncedUpdate({
      companyName: watchedFields.companyName,
      industry: watchedFields.industry,
      website: watchedFields.website,
      companyDetails: watchedFields.companyDetails,
    });
  }, [watchedFields.companyName, watchedFields.industry, watchedFields.website, watchedFields.companyDetails]);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setLogoPreview(preview);
        updateCompanyDetails({
          logo: {
            file,
            preview,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="space-y-2">
        <label htmlFor="companyName" className="block text-sm font-medium">
          Organization Name 
        </label>
        <input
          id="companyName"
          type="text"
          className=" w-full rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6"
          placeholder="Name of your organization"
          {...register('companyName', { required: 'Organization name is required' })}
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">{errors.companyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="industry" className="block text-sm font-medium">
          Industry
        </label>
        <input
          id="industry"
          type="text"
          className=" w-full rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6"
          placeholder="Enter Industry"
          {...register('industry')}
        />
        {errors.industry && (
          <p className="text-sm text-red-500">{errors.industry.message}</p>
        )}
      </div>


      <div className="space-y-2">
        <label htmlFor="companyDetails" className="block text-sm font-medium">
          Organization Details 
        </label>
        <textarea
          placeholder="Details of your organization that your chatbot should know"
          className="w-full h-60 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6 resize-y"
          {...register('companyDetails', { required: 'Organization Details is required' })}
        />
        {errors.companyDetails && (
          <p className="text-sm text-red-500">{errors.companyDetails.message}</p>
        )}
      </div>

      {/* <div className="space-y-2">
        <ImageUpload onImageChange={handleLogoChange} />
      </div> */}
    </div>
  );
};