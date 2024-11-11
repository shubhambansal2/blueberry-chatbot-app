import { useForm } from 'react-hook-form';
import { useChatbotStore } from '../../store/useChatbotStore';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import ImageUpload from '../ImageUpload';

interface ChatbotDetailsInputs {
  name: string;
  avatar: FileList;
  personality: string;
  description: string;
}

export const ChatbotDetailsForm = () => {
  const { chatbotDetails, updateChatbotDetails } = useChatbotStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    chatbotDetails.avatar?.preview || null
  );

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ChatbotDetailsInputs>({
    defaultValues: {
      name: chatbotDetails.name,
      personality: chatbotDetails.personality,
      description: chatbotDetails.description,
    },
  });

  // Watch all form fields
  const watchedFields = watch();

  // Debounced update function
  const debouncedUpdate = debounce((data: Partial<ChatbotDetailsInputs>) => {
    const formData = {
      name: data.name,
      personality: data.personality,
      description: data.description,
    };
    updateChatbotDetails(formData);
  }, 500);

  // Update store when form values change
  useEffect(() => {
    debouncedUpdate({
      name: watchedFields.name,
      personality: watchedFields.personality,
      description: watchedFields.description,
    });
  }, [watchedFields.name, watchedFields.personality, watchedFields.description]);

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setAvatarPreview(preview);
        updateChatbotDetails({
          avatar: {
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
        <label htmlFor="name" className="block text-sm font-medium">
          Chatbot Name *
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6"
          placeholder="Give your chatbot a name"
          {...register('name', { required: 'Chatbot name is required' })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="personality" className="block text-sm font-medium">
          Personality *
        </label>
        <textarea
          id="personality"
          className="w-full h-32 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6 resize-y"
          placeholder="Describe your chatbot's personality and tone"
          {...register('personality', { required: 'Personality description is required' })}
        />
        {errors.personality && (
          <p className="text-sm text-red-500">{errors.personality.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description *
        </label>
        <textarea
          id="description"
          className="w-full h-48 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6 resize-y"
          placeholder="Provide a detailed description of your chatbot's purpose and capabilities"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* <div className="space-y-2">
        <ImageUpload onImageChange={handleAvatarChange} />
      </div> */}
    </div>
  );
};