import React from 'react';

export interface ChatbotColor {
  id: string;
  value: string;
  name: string;
}

const COLORS: ChatbotColor[] = [
  { id: 'blue', value: '#2563eb', name: 'Blue' },
  { id: 'green', value: '#059669', name: 'Green' },
  { id: 'purple', value: '#7c3aed', name: 'Purple' },
  { id: 'orange', value: '#ea580c', name: 'Orange' },
  { id: 'gray', value: '#4b5563', name: 'Gray' }
];

interface ColorSelectorProps {
  value: ChatbotColor | null;
  onChange: (color: ChatbotColor) => void;
}

const ColorSelector = ({ value, onChange }: ColorSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Color *
      </label>
      <div className="flex gap-4 items-center">
        {COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color)}
            className={`group relative rounded-full w-8 h-8 flex items-center justify-center ${
              value?.id === color.id ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{ 
              backgroundColor: color.value,
              outlineColor: color.value
            }}
            aria-label={color.name}
          >
            {value?.id === color.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;