'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useData } from '@/lib/context';

function CatalogContent() {
  const { data, loading } = useData();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const categoryFilter = searchParams.get('category');
  const featuredOnly = searchParams.get('featured') === 'true';

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    let products = [...data.products];

    if (categoryFilter) {
      const cat = data.categories.find((c) => c.slug === categoryFilter);
      if (cat) products = products.filter((p) => p.categoryId === cat.id);
    }

    if (featuredOnly) {
      products = products.filter((p) => p.featured);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [data, categoryFilter, featuredOnly, search, sortBy]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCategory = categoryFilter
    ? data.categories.find((c) => c.slug === categoryFilter)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {activeCategory ? activeCategory.name : featuredOnly ? 'Produits phares' : 'Catalogue'}
        </h1>
        <p className="text-gray-500 mt-1">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary/40"
          >
            <option value="default">Par défaut</option>
            <option value="name">Nom A-Z</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/catalog/"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !categoryFilter && !featuredOnly
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/40'
          }`}
        >
          Tous
        </a>
        {data.categories.map((cat) => (
          <a
            key={cat.id}
            href={`/catalog/?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === cat.slug
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/40'
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
