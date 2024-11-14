'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const useBrowserNavigationGuard = (
  hasUnsavedChanges: boolean,
  onReset: () => void
) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    let isLeaving = false;

    // Handle browser's back/forward buttons and tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = "You have unsaved changes. Are you sure you want to leave?";
      e.preventDefault();
      e.returnValue = message;

      // If user decides to leave, the form will be reset in the cleanup function
      isLeaving = true;
      return message;
    };

    // Add event listener for browser navigation
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // If we're actually leaving the page (not just unmounting the component),
      // reset the form
      if (isLeaving) {
        onReset();
      }
    };
  }, [hasUnsavedChanges, onReset, pathname]);
};