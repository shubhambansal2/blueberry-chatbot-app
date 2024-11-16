import React from 'react';
import { User, MessageCircle } from 'lucide-react';

const ChatSkeleton = ({ numberOfMessages = 10 }) => {
  const skeletonMessages = Array(numberOfMessages).fill(null);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-4">
        {skeletonMessages.map((_, index) => {
          const isUser = index % 2 === 0;
          
          return (
            <div
              key={index}
              className={`flex items-start space-x-2 mb-4 ${
                isUser ? 'justify-start' : 'justify-end'
              }`}
            >
              {isUser && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isUser ? 'bg-gray-100' : 'bg-gray-100'
                }`}
              >
                {/* Sender name skeleton */}
                <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                
                {/* Message content skeleton lines */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                  {index % 2 === 0 && (
                    <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse" />
                  )}
                </div>
              </div>
              {!isUser && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSkeleton;