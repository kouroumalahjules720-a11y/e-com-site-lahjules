import type { Metadata } from 'next';
import { DataProvider, CartProvider } from '@/lib/context';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOYAL FRIENDS STORE - Boutique Premium en Ligne',
  description:
    'LOYAL FRIENDS STORE — Découvrez notre sélection de produits premium. Commandez facilement via WhatsApp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <DataProvider>
          <CartProvider>{children}</CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}
