import React from 'react';

const ChatbotLoadingSkeleton = () => {
  return (
    <div 
      className="relative group w-64 h-80 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full p-6">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          {/* Icon placeholder */}
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
          
          {/* Text content */}
          <div className="text-center space-y-3">
            {/* Chatbot name placeholder */}
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mx-auto" />
            {/* Company name placeholder */}
            <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mx-auto" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-300/20 via-transparent to-white/10" />
    </div>
  );
};

export default ChatbotLoadingSkeleton;