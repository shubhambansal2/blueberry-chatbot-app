import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import Image from 'next/image';


const ImageUpload = ({ onImageChange }: { onImageChange: (file: File | null) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setPreview(e.target!.result as string);
      if (onImageChange) {
        onImageChange(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <label className="block text-sm font-medium">Company Logo</label>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="image-upload"
      />

      {!preview ? (
        <Card
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => document.getElementById('image-upload')!.click()}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Drop your image here or click to upload
              </p>
              <p className="text-xs text-gray-500">
                Support for JPG, PNG or GIF files
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="relative overflow-hidden">
          <Image 
            src={preview || ''}
            alt="Uploaded company logo"
            width={500}
            height={300}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;