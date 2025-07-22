'use client';

import AuthenticatedLayout from './AuthenticatedLayout';

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }