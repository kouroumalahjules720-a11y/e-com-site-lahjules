'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  CreditCard,
  Facebook,
  LogOut,
  Menu,
  X,
  Download,
} from 'lucide-react';
import { useState } from 'react';
import { logout, isAuthenticated } from '@/lib/auth';
import { useData } from '@/lib/context';
import { exportDataFile } from '@/lib/storage';
import Logo from '@/components/Logo';
import clsx from 'clsx';

const navItems = [
  { href: '/admin/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/products/', label: 'Produits', icon: Package },
  { href: '/admin/orders/', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/promos/', label: 'Codes promo', icon: Tag },
  { href: '/admin/payments/', label: 'Paiements', icon: CreditCard },
  { href: '/admin/facebook/', label: 'Pub Facebook', icon: Facebook },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login/');
  };

  const handleExport = () => {
    if (!data) return;
    exportDataFile(data.products, 'products.json');
    exportDataFile(data.categories, 'categories.json');
    exportDataFile(data.reviews, 'reviews.json');
    exportDataFile(data.orders, 'orders.json');
    exportDataFile(data.promos, 'promos.json');
    exportDataFile(data.payments, 'payments.json');
    exportDataFile(data.config, 'config.json');
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 bg-primary-darker text-gray-300 transform transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="mb-3">
              <Logo uploadable onDark showName={false} />
            </div>
            <Link href="/admin/" className="block">
              <span className="text-lg font-semibold text-white">Admin</span>
              <span className="block text-xs text-white/60 mt-0.5">LOYAL FRIENDS STORE</span>
            </Link>
            <p className="text-[10px] text-white/40 mt-2">
              Cliquez sur le logo pour le modifier
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/admin/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-secondary text-white'
                      : 'hover:bg-white/10 text-gray-300 hover:text-white'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Exporter JSON
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Voir la boutique
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login/') {
    return <>{children}</>;
  }

  if (typeof window !== 'undefined' && !isAuthenticated()) {
    router.push('/admin/login/');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
