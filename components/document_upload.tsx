import React, { useState } from 'react';

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    
    // Validate file type
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setSelectedFile(file);
      setMessage(''); // Reset any error messages
    } else {
      setMessage('Please upload a valid PDF or TXT file.');
      setSelectedFile(null);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      setIsProcessing(true);
      
      // Simulate document processing (could be replaced by an API call)
      setTimeout(() => {
        setIsProcessing(false);
        setMessage(`Your document "${selectedFile.name}" has been processed successfully!`);
        setSelectedFile(null); // Reset the file input
      }, 2000); // Simulate a 2-second processing time
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Your Document</h2>
      
      <input
        type="file"
        accept=".pdf, .txt"
        onChange={handleFileChange}
        className="mb-4"
      />
      
      {selectedFile && (
        <div className="mb-4">
          <p>Selected File: {selectedFile.name}</p>
          <button
            onClick={handleFileUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Upload and Process'}
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default DocumentUpload