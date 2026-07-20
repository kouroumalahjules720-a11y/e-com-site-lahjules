'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar, { AdminAuthGuard } from '@/components/admin/AdminSidebar';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === '/admin/login/';

  useEffect(() => {
    if (!isLoginPage && !isAuthenticated()) {
      router.replace('/admin/login/');
    }
    setChecked(true);
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
