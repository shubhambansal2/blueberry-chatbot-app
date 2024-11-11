'use client';

import { SidebarLayout } from "../../components/Sidebar"; 
import AuthGuard from "./AuthGuard";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <AuthGuard>
        <SidebarLayout>
      {children}
    </SidebarLayout>
      </AuthGuard>
    
  );
}