'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import Button from '@/components/ui/Button';
import { useData } from '@/lib/context';

export default function HomePage() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const featuredProducts = data.products.filter((p) => p.featured);
  const categories = data.categories;

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Produits phares</h2>
            <p className="text-gray-500 mt-1">Notre sélection du moment</p>
          </div>
          <Link href="/catalog/" className="hidden sm:block">
            <Button variant="ghost">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/catalog/">
            <Button variant="outline">Voir tout le catalogue</Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-primary-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Catégories</h2>
            <p className="text-gray-500 mt-1">Explorez nos univers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-secondary to-secondary-hover py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Commandez en un clic via WhatsApp
          </h2>
          <p className="text-white/90 max-w-lg mx-auto mb-8">
            Ajoutez vos produits au panier et finalisez votre commande directement
            sur WhatsApp. Simple, rapide et sécurisé.
          </p>
          <Link href="/catalog/">
            <Button size="lg" variant="primary" className="bg-white text-primary hover:bg-primary-light">
              Commencer mes achats
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
