import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '../ShopContext';

const GradientButton = () => {
  const router = useRouter();
  const shop = useShop();
  const primaryColor = '#9e85b3';
  const darkerShade = '#846b98';  // Darker version
  const lighterShade = '#b8a3cc';  // Lighter version

  return (
    
      <button 
        className="relative group w-64 h-80 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden"
        onClick={() => {
          console.log('Button clicked!');
          router.push(`/createchatbot${shop ? `?shop=${shop}` : ''}`);
        }}
        style={{
          background: `linear-gradient(135deg, ${darkerShade} 0%, ${primaryColor} 50%, ${lighterShade} 100%)`
        }}
      >
        {/* Alternative stripe approach using multiple gradients */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: `
              linear-gradient(135deg, 
                transparent 0%, 
                rgba(255,255,255,0.1) 35%, 
                transparent 70%
              )
            `,
            backgroundSize: '200% 200%',
            transform: 'rotate(-45deg) scale(2)',
          }}
        />
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

        {/* Hover effect */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full space-y-4 transform group-hover:scale-105 transition-transform duration-300">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Plus className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold">Create new AI Agent</h3>
            {/* <p className="text-white text-lg">Chatbot</p> */}
          </div>
        </div>
        
        {/* Bottom shadow overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
  );
};

export default GradientButton;