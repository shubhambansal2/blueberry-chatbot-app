import React from 'react';
import { Database, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { IconDatabase } from '@tabler/icons-react';

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
  Chatbottype = 'Data',
  disabled = false,
}) => {
  // Get color values from the selected scheme
  const colors = colorSchemes[colorScheme];
  const { primary, darker, lighter } = colors;

  return (
    <div 
      className={`relative group w-64 h-80 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
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
      <div className={`relative h-full p-6 ${!disabled ? 'hover:scale-105' : ''}`} onClick={!disabled ? onClick : undefined}>
        <div className="flex flex-col items-center justify-center h-full space-y-4 transform transition-transform duration-300">
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
      {/* Data integration icon */}
      {Chatbottype === 'Data' && (
        <div className="absolute top-4 left-4 group/tooltip">
          <IconDatabase className="w-6 h-6 text-white" />
          <div className="absolute left-0 -bottom-12 hidden group-hover/tooltip:block bg-black/75 text-white text-sm rounded px-2 py-1 whitespace-nowrap">
            This agent has a data integration.
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className={`p-2 rounded-full transition-colors duration-200 ${
            disabled 
              ? 'bg-white/20 cursor-not-allowed' 
              : 'bg-white/10 hover:bg-white/20'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              onEdit();
            }
          }}
          disabled={disabled}
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>
        <button
          className={`p-2 rounded-full transition-colors duration-200 ${
            disabled 
              ? 'bg-white/20 cursor-not-allowed' 
              : 'bg-white/10 hover:bg-red-500/80'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              onDelete();
            }
          }}
          disabled={disabled}
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