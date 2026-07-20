'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, MessageCircle, ShoppingBag, Tag } from 'lucide-react';
import { useCart, useData } from '@/lib/context';
import {
  applyPromoCode,
  createOrder,
  formatPrice,
  generateOrderCode,
} from '@/lib/storage';
import { buildCartWhatsAppMessage, buildWhatsAppUrl, getWhatsAppNumber } from '@/lib/whatsapp';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data, updateData } = useData();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const config = data?.config;
  const activePayments = data?.payments.filter((p) => p.active) ?? [];
  const total = cartTotal - discount;

  const handleApplyPromo = () => {
    if (!data || !promoInput.trim()) return;
    const result = applyPromoCode(data.promos, promoInput.trim(), cartTotal);
    if (result.error) {
      setPromoError(result.error);
      setAppliedPromo(null);
      setDiscount(0);
    } else {
      setPromoError('');
      setAppliedPromo(result.promo!.code);
      setDiscount(result.discount);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!data || !config || cart.length === 0) return;

    const orderCode = generateOrderCode();
    const selectedPayment =
      activePayments.find((p) => p.id === paymentMethod)?.name || 'Non spécifié';

    const { order } = createOrder(data, {
      code: orderCode,
      customerName: customerName || 'Client',
      customerPhone: customerPhone || 'Non renseigné',
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: cartTotal,
      discount,
      total,
      promoCode: appliedPromo || undefined,
      paymentMethod: selectedPayment,
      status: 'pending',
    });

    updateData({ ...data, orders: [order, ...data.orders] });

    const message = buildCartWhatsAppMessage(cart, config, {
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      promoCode: appliedPromo || undefined,
      discount,
      paymentMethod: selectedPayment,
      orderCode,
    });

    window.open(buildWhatsAppUrl(getWhatsAppNumber(config), message), '_blank');
    clearCart();
    setOrderPlaced(orderCode);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier.</p>
        <Link href="/catalog/">
          <Button size="lg">Voir le catalogue</Button>
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande envoyée !</h1>
        <p className="text-gray-500 mb-4">
          Votre code de commande est :
        </p>
        <p className="text-2xl font-bold text-primary mb-6">{orderPlaced}</p>
        <p className="text-sm text-gray-500 mb-6">
          Conservez ce code pour suivre votre commande.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/track-order/?code=${orderPlaced}`}>
            <Button variant="outline">Suivre ma commande</Button>
          </Link>
          <Link href="/catalog/">
            <Button>Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.productId} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-primary font-medium mt-1">
                    {formatPrice(item.price, config?.currencySymbol)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity, config?.currencySymbol)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h2>

            {/* Promo code */}
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Code promo"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  error={promoError}
                />
                <Button variant="outline" size="sm" onClick={handleApplyPromo} className="mt-0 self-start shrink-0">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              {appliedPromo && (
                <p className="text-sm text-green-600 mt-1">
                  Code {appliedPromo} appliqué (-{formatPrice(discount, config?.currencySymbol)})
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Sous-total</span>
                <span>{formatPrice(cartTotal, config?.currencySymbol)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span>
                  <span>-{formatPrice(discount, config?.currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(total, config?.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Customer info */}
            <div className="space-y-3 mt-6 border-t border-gray-100 pt-4">
              <Input
                label="Votre nom"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nom complet"
              />
              <Input
                label="Téléphone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ex: 627081650"
              />
              {activePayments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mode de paiement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary/40"
                  >
                    <option value="">Choisir...</option>
                    {activePayments.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Button
              variant="cta"
              size="lg"
              className="w-full mt-6"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle className="w-5 h-5" />
              Commander sur WhatsApp
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
