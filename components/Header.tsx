'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X, Package, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/context';
import Logo from '@/components/Logo';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/catalog/', label: 'Catalogue' },
  { href: '/track-order/', label: 'Suivi commande' },
];

export default function Header() {
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center min-w-0">
            <Logo onDark showName />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/90 hover:text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog/"
              className="hidden sm:flex p-2 text-white/80 hover:text-secondary transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/cart/"
              className="relative p-2 text-white/90 hover:text-secondary transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-white/90"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 bg-primary-dark">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/90 hover:bg-white/10 hover:text-secondary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/90 hover:bg-white/10 hover:text-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Package className="w-4 h-4" />
              Panier {cartCount > 0 && `(${cartCount})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
