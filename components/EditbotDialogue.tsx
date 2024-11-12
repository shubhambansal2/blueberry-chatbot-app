import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface LeaveDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveDialog = ({ onConfirm, onCancel }: LeaveDialogProps) => {
  return (
    <AlertDialog open={true} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-gray-900">
            Leave without saving?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="text-gray-600">
              You have unsaved changes. If you leave, your changes will be lost.
            </p>
            <p className="text-sm text-gray-500">
              Click 'Stay' to continue editing, or 'Leave' to exit without saving.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-gray-100 hover:bg-gray-200"
            onClick={onCancel}
          >
            Stay
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
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