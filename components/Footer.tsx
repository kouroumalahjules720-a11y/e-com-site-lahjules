import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo onDark showName />
            </div>
            <p className="text-white/70 max-w-md leading-relaxed">
              LOYAL FRIENDS STORE — Votre boutique premium en ligne. Des produits de
              qualité, une expérience d&apos;achat simple et une livraison rapide
              partout en Guinée.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-secondary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalog/" className="text-white/70 hover:text-secondary transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/cart/" className="text-white/70 hover:text-secondary transition-colors">
                  Panier
                </Link>
              </li>
              <li>
                <Link href="/track-order/" className="text-white/70 hover:text-secondary transition-colors">
                  Suivi commande
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="tel:+224627081650" className="text-white/80 hover:text-secondary transition-colors">
                  +224 627 08 16 50
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a
                  href="mailto:loyalfriends0718@gmail.com"
                  className="text-white/80 hover:text-secondary transition-colors break-all"
                >
                  loyalfriends0718@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-white/80">Conakry, Guinée</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} LOYAL FRIENDS STORE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
