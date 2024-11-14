'use client'

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

type DeleteDialogProps = {
  onDelete: () => Promise<void>;
  chatbotName: string;
};

const DeleteDialog = ({ onDelete, chatbotName }: DeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setIsOpen(false);
    
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting chatbot:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-gray-900">Deleting chatbot...</span>
          </div>
        </div>
      )}
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <button 
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center justify-center space-x-2"
            disabled={isDeleting}
          >
            <span>Delete Chatbot</span>
          </button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete {chatbotName}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete this chatbot? This action cannot be undone.
              </p>
              <p className="text-sm text-gray-500">
                All associated data and configurations will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;