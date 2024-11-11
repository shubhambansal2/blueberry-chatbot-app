// components/SidebarStateProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface SidebarStateContextType {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;  // Changed this type
}

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(undefined);

export function SidebarStateProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <SidebarStateContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarStateContext.Provider>
  );
}

export function useSidebarState() {
  const context = useContext(SidebarStateContext);
  if (!context) {
    throw new Error('useSidebarState must be used within SidebarStateProvider');
  }
  return context;
}