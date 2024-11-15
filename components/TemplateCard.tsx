import React from 'react';
import { GraduationCap, Building2, Search } from 'lucide-react';

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
  icon = 'school' // default icon
}: TemplateProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'school':
        return <GraduationCap className="w-6 h-6 text-white" />;
      case 'services':
        return <Building2 className="w-6 h-6 text-white" />;
      case 'recruitment':
        return <Search className="w-6 h-6 text-white" />;
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
        onClick={() => console.log(`Selected template: ${template_id}`)}
      >
        Select template
      </button>
    </div>
  );
};

export default TemplateCard;