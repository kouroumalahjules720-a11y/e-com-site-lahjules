'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/storage';
import { buildSingleProductWhatsAppMessage, buildWhatsAppUrl, getWhatsAppNumber } from '@/lib/whatsapp';
import { useData, useCart } from '@/lib/context';
import ReviewSection from '@/components/ReviewSection';
import StarRating from '@/components/StarRating';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { data } = useData();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const config = data?.config;
  const category = data?.categories.find((c) => c.id === product.categoryId);
  const reviews = data?.reviews.filter((r) => r.productId === product.id) ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleWhatsApp = () => {
    if (!config) return;
    const message = buildSingleProductWhatsAppMessage(
      `${product.name} (x${quantity})`,
      product.price * quantity,
      config
    );
    window.open(buildWhatsAppUrl(getWhatsAppNumber(config), message), '_blank');
  };

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/catalog/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card">
            <img
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link
              href={`/catalog/?category=${category.slug}`}
              className="text-sm text-primary font-medium hover:underline"
            >
              {category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>

          {reviews.length > 0 && (
            <div className="mt-2">
              <StarRating rating={avgRating} showValue />
              <span className="text-sm text-gray-500 ml-2">
                ({reviews.length} avis)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-accent">
              {formatPrice(product.price, config?.currencySymbol)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice, config?.currencySymbol)}
                </span>
                <Badge variant="promo">
                  -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">{product.longDescription}</p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantité</span>
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {!product.inStock && (
                <Badge variant="warning">Rupture de stock</Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Ajouté !
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Ajouter au panier
                  </>
                )}
              </Button>
              <Button
                variant="cta"
                size="lg"
                className="flex-1"
                onClick={handleWhatsApp}
                disabled={!product.inStock}
              >
                <MessageCircle className="w-5 h-5" />
                Commander sur WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} reviews={reviews} />
    </div>
  );
}
