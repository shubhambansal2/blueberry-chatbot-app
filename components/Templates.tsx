import TemplateCard from './TemplateCard';

const TemplateCardShowcase = () => {
    const templates = [
      {
        color: '#34D399', // emerald-400
        name: 'High School Fair',
        description: 'Enhance event experience with our customizable high school fair chatbot template.',
        template_id: 'hsf-001',
        icon: 'school'
      },
      {
        color: '#22D3EE', // cyan-400
        name: 'Citizens Services',
        description: 'Streamline the citizen services with our versatile and reliable chatbot template',
        template_id: 'cs-001',
        icon: 'services'
      },
      {
        color: '#FB7185', // red-400
        name: 'Recruitment',
        description: 'Automate tasks, save time with our engaging recruitment chatbot template.',
        template_id: 'rec-001',
        icon: 'recruitment'
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