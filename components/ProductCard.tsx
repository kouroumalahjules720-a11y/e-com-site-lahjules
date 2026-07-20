'use client';

import Link from 'next/link';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/storage';
import { buildSingleProductWhatsAppMessage, buildWhatsAppUrl, getWhatsAppNumber } from '@/lib/whatsapp';
import { useData, useCart } from '@/lib/context';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface ProductCardProps {
  product: Product;
  showWhatsApp?: boolean;
}

export default function ProductCard({ product, showWhatsApp = true }: ProductCardProps) {
  const { data } = useData();
  const { addToCart } = useCart();
  const config = data?.config;

  const handleWhatsApp = () => {
    if (!config) return;
    const message = buildSingleProductWhatsAppMessage(
      product.name,
      product.price,
      config
    );
    window.open(buildWhatsAppUrl(getWhatsAppNumber(config), message), '_blank');
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Card hover className="group flex flex-col">
      <Link href={`/product/${product.slug}/`} className="block relative overflow-hidden">
        <div className="aspect-square bg-primary-light overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {product.featured && (
          <Badge variant="success" className="absolute top-3 left-3">
            Nouveau
          </Badge>
        )}
        {product.compareAtPrice && (
          <Badge variant="promo" className="absolute top-3 right-3">
            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
          </Badge>
        )}
        {product.inStock && (
          <Badge variant="success" className="absolute bottom-3 left-3">
            En stock
          </Badge>
        )}
        {!product.inStock && (
          <Badge variant="warning" className="absolute bottom-3 left-3">
            Rupture
          </Badge>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}/`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className={`text-lg font-bold ${
                product.compareAtPrice ? 'text-accent' : 'text-primary'
              }`}
            >
              {formatPrice(product.price, config?.currencySymbol)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice, config?.currencySymbol)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
              Panier
            </Button>
            {showWhatsApp && (
              <Button
                variant="cta"
                size="sm"
                className="flex-1"
                onClick={handleWhatsApp}
                disabled={!product.inStock}
              >
                <MessageCircle className="w-4 h-4" />
                Commander
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
