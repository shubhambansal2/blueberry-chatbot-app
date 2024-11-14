import React from 'react';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';

// Color scheme options
const colorSchemes = {
  maroon: {
    primary: '#800020',
    darker: '#4A0012',
    lighter: '#B22222',
    name: 'Maroon'
  },
  ocean: {
    primary: '#1E4D6B',
    darker: '#0A2A41',
    lighter: '#2E7DA1',
    name: 'Ocean Blue'
  },
  forest: {
    primary: '#2D5A27',
    darker: '#1A3D15',
    lighter: '#4A7A43',
    name: 'Forest Green'
  },
  plum: {
    primary: '#673147',
    darker: '#421D2D',
    lighter: '#8B4B63',
    name: 'Plum'
  },
  slate: {
    primary: '#2F4858',
    darker: '#1C2B35',
    lighter: '#456778',
    name: 'Slate'
  },
  sunset: {
    primary: '#985E49',
    darker: '#6B3D2E',
    lighter: '#C1826D',
    name: 'Sunset'
  }
};

// Define a type for the color scheme keys
type ColorSchemeKey = keyof typeof colorSchemes;

const GradientCard = ({ 
  chatbotName = "Chatbot Name",
  companyName = "Company Name",
  colorScheme = 'maroon' as ColorSchemeKey, // type the colorScheme prop
  onEdit = () => console.log('Edit clicked!'),
  onDelete = () => console.log('Delete clicked!'),
  onClick = () => console.log('Card clicked!'),
}) => {
  // Get color values from the selected scheme
  const colors = colorSchemes[colorScheme];
  const { primary, darker, lighter } = colors;

  return (
    <div 
      className="relative group w-64 h-80 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${darker} 0%, ${primary} 50%, ${lighter} 100%)`
      }}
    >
      {/* Gradient overlays */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 35%, transparent 70%)`,
          backgroundSize: '200% 200%',
          transform: 'rotate(-45deg) scale(2)',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative h-full p-6" onClick={onClick}>
        <div className="flex flex-col items-center justify-center h-full space-y-4 transform group-hover:scale-105 transition-transform duration-300">
          <div className="bg-white/90 rounded-full p-4 shadow-lg">
            <MessageSquare className="w-8 h-8" style={{ color: primary }} />
          </div>
          
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold mb-2">{chatbotName}</h3>
            <p className="text-white/90 text-base">{companyName}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>
        <button
          className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {/* Bottom shadow overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

// Export color schemes so they can be used elsewhere
export { colorSchemes };
export default GradientCard;