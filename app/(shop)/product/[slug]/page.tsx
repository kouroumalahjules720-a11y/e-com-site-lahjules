import productsData from '@/public/data/products.json';
import type { Product } from '@/lib/types';
import ProductDetailClient from './ProductDetailClient';

const products = productsData as Product[];

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Produit introuvable</h1>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
