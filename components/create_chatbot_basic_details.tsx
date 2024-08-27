import React from 'react';

type CreateChatbotBasicDetailsProps = {
  name: string;
  setName: (name: string) => void;
  personality: string;
  setPersonality: (personality: string) => void;
  role: string;
  setRole: (role: string) => void;
  companyName: string;
  setCompanyName: (companyName: string) => void;
};

const CreateChatbotBasicDetails = ({
  name,
  setName,
  personality,
  setPersonality,
  companyName,
  setCompanyName,
  role,
  setRole
}: CreateChatbotBasicDetailsProps) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Personality</label>
        <input
          type="text"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black"
          required
        />
      </div>
    </div>
  );
};

export default CreateChatbotBasicDetails;