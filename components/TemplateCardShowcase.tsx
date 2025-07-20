import TemplateCard from './TemplateCard';
import { tshirtStoreTemplate, coffeeTeaSpicesTemplate, organicProductsTemplate } from '../store/templates';
import { useChatbotStore } from '../store/useChatbotStore';

const TemplateCardShowcase = () => {
    const templates = [
      {
        color: '#34D399', // emerald-400
        name: 'Tshirt Store',
        description: 'Streamline customer interactions with our tshirt store chatbot template.',
        template_id: 'hsf-001',
        icon: 'tshirt'
      },
      {
        color: '#22D3EE', // cyan-400
        name: 'Coffee, Tea and Spices',
        description: 'Engage customers with our coffee, tea and spices chatbot template.',
        template_id: 'cs-001',
        icon: 'coffee'
      },
      {
        color: '#FB7185', // red-400
        name: 'Organic Products',
        description: 'Enhance user experience with our organic products store chatbot template.',
        template_id: 'rec-001',
        icon: 'organic'
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