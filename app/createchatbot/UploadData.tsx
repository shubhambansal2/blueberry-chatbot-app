import React from 'react';
import { Button } from 'antd';
import DocumentUpload from '@/components/document_upload';

interface UploadDataProps {
    setFileData: (file: File | null) => void;
    fileData: File | null;
}

const UploadData: React.FC<UploadDataProps> = ({
    fileData,
    setFileData,
}) => {
    return (
    <>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Upload Data
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
            Finetune your data
        </p>
        <DocumentUpload
            fileData={fileData}
            setFileData={setFileData}
        />
    </>
    );
};

export default UploadData;