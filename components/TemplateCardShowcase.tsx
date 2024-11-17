import TemplateCard from './TemplateCard';
import { coffeeShopTemplate, travelTemplate, hospitalTemplate, insuranceTemplate } from '../store/templates';
import { useChatbotStore } from '../store/useChatbotStore';

const TemplateCardShowcase = () => {
    const templates = [
      {
        color: '#34D399', // emerald-400
        name: 'Coffee Shop',
        description: 'Streamline customer interactions with our coffee shop chatbot template.',
        template_id: 'hsf-001',
        icon: 'coffee'
      },
      {
        color: '#22D3EE', // cyan-400
        name: 'Travel Platform',
        description: 'Engage travelers with our travel platform chatbot template.',
        template_id: 'cs-001',
        icon: 'travel'
      },
      {
        color: '#FB7185', // red-400
        name: 'Hospital',
        description: 'Enhance patient experiences with our hospital chatbot template.',
        template_id: 'rec-001',
        icon: 'hospital'
      },
      {
        color: '#FBBF24', // amber-400
        name: 'Insurance',
        description: 'Streamline customer interactions with our insurance chatbot template.',
        template_id: 'ins-001',
        icon: 'insurance'
      }
    ];
  
    return (
      <div className="flex flex-wrap gap-6 p-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.template_id}
            {...template}
          />
        ))}
      </div>
    );
  };
  
  export default TemplateCardShowcase;