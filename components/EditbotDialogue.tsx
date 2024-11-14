'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from "./ui/alert-dialog"

type LeaveDialogProps = {
  onReset: () => void;
};

const LeaveDialog = ({ onReset }: LeaveDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLeave = () => {
    onReset(); // Reset the form
    setIsOpen(false);
    router.push('/testchatbot');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button 
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-400 rounded-md transition-colors"
        >
          Leave without saving
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-gray-900">
            Leave without saving changes?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Your changes will be lost if you leave this page. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Continue editing
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            className="bg-blue-900 hover:bg-blue-700 text-white"
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveDialog;