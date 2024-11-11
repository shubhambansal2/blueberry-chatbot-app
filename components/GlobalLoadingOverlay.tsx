import React from 'react';
import { Loader2 } from 'lucide-react';
import { GridPattern } from './GridPattern';

const pattern = {
  y: -6,
  squares: [
    [-1, 2],
    [1, 3],
    // Random values between -10 and 10
    ...Array.from({ length: 10 }, () => [
      Math.floor(Math.random() * 20) - 10,
      Math.floor(Math.random() * 20) - 10,
    ]),
  ],
};

const GlobalLoadingOverlay = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-4 p-8 rounded-xl bg-gray-900/80">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
        <p className="text-white text-lg font-medium">{message}</p>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50 -z-10">
          <GridPattern
            width={120}
            height={120}
            x="50%"
            className="absolute inset-x-0 inset-y-[-30%] h-[160%]  w-full skew-y-[-5deg] fill-tertiary/[0.05] stroke-gray-100  dark:fill-primary dark:stroke-gray-100"
            {...pattern}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;