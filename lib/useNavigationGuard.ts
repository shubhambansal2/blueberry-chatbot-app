import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationGuardProps {
  hasUnsavedChanges?: boolean;
  onNavigate?: (path: string) => void;
}

export const useNavigationGuard = ({ 
  hasUnsavedChanges = true,
  onNavigate 
}: NavigationGuardProps = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Handle browser back/forward buttons and page refreshes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle navigation attempts
  const handleNavigationAttempt = useCallback((url: string) => {
    if (hasUnsavedChanges) {
      setPendingUrl(url);
      setShowLeaveDialog(true);
      return false;
    }
    return true;
  }, [hasUnsavedChanges]);

  const handleConfirmLeave = useCallback(() => {
    setShowLeaveDialog(false);
    if (pendingUrl && onNavigate) {
      onNavigate(pendingUrl);
    }
    setPendingUrl(null);
  }, [pendingUrl, onNavigate]);

  const handleCancelLeave = useCallback(() => {
    setShowLeaveDialog(false);
    setPendingUrl(null);
  }, []);

  // Listen for pathname changes
  useEffect(() => {
    if (pathname && hasUnsavedChanges) {
      handleNavigationAttempt(pathname);
    }
  }, [pathname, hasUnsavedChanges, handleNavigationAttempt]);

  return {
    showLeaveDialog,
    onConfirmLeave: handleConfirmLeave,
    onCancelLeave: handleCancelLeave,
    checkNavigation: handleNavigationAttempt
  };
};