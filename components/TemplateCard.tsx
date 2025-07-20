import React from 'react';
import { GraduationCap, Building2, Search, Coffee, Hospital, PlaneIcon, HeartIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatbotStore } from 'store/useChatbotStore';
import { coffeeTeaSpicesTemplate, tshirtStoreTemplate, organicProductsTemplate } from 'store/templates';


interface TemplateProps {
  color?: string;
  name: string;
  description: string;
  template_id: string;
  icon?: string;
}

const TemplateCard = ({ 
  color = '#34D399', // default emerald-400
  name, 
  description,
  template_id,
  icon = 'coffee' // default icon
}: TemplateProps) => {
  const router = useRouter();

  const handleTemplateSelect = (template_id: string) => {
    console.log(`Selected template: ${template_id}`);
    useChatbotStore.setState(template_id === 'hsf-001' ? tshirtStoreTemplate : template_id === 'cs-001' ? coffeeTeaSpicesTemplate : template_id === 'rec-001' ? organicProductsTemplate : organicProductsTemplate);
    router.push(`/createchatbot`);
  };

  const getIcon = () => {
    switch (icon) {
      case 'coffee':
        return <Coffee className="w-6 h-6 text-white" />;
      case 'travel':
        return <PlaneIcon className="w-6 h-6 text-white" />;
      case 'hospital':
        return <Hospital className="w-6 h-6 text-white" />;
      case 'insurance':
        return <HeartIcon className="w-6 h-6 text-white" />;
      default:
        return <GraduationCap className="w-6 h-6 text-white" />;
    }
  };
  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-sm">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: color }}
      >
        {getIcon()}
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {name}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      <button 
        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        onClick={() => handleTemplateSelect(template_id)}
      >
        Select template
      </button>
    </div>
  );
};

export default TemplateCard;