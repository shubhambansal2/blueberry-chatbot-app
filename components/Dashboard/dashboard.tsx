import React, { Fragment } from 'react';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-gray-200/[0.2] pointer-events-none"></div>
        <h1 className="text-5xl font-bold text-gray-800 text-center z-10 px-4">
          Create your custom chatbots<br />and deploy them on the go !
        </h1>
      </div>
    </div>
  );
}

export default Dashboard;
