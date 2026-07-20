'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock } from 'lucide-react';
import { useData } from '@/lib/context';
import { formatPrice } from '@/lib/storage';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

function TrackOrderContent() {
  const { data } = useData();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [searched, setSearched] = useState(!!searchParams.get('code'));

  const order = searched && data
    ? data.orders.find((o) => o.code.toUpperCase() === code.toUpperCase())
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <Package className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Suivi de commande</h1>
        <p className="text-gray-500 mt-2">
          Entrez votre code de commande pour connaître le statut
        </p>
      </div>

      <Card className="p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            placeholder="Ex: CMD-X7K2M9"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setSearched(false);
            }}
            className="flex-1"
          />
          <Button type="submit" className="self-end shrink-0">
            <Search className="w-4 h-4" />
            Rechercher
          </Button>
        </form>
      </Card>

      {searched && !order && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Aucune commande trouvée avec le code <strong>{code}</strong>
          </p>
        </Card>
      )}

      {order && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Code commande</p>
              <p className="text-xl font-bold text-gray-900">{order.code}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                ORDER_STATUS_COLORS[order.status]
              }`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500">Client</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500">Téléphone</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-gray-500">Paiement</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Date
              </p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Articles</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity, data?.config.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 font-bold">
              <span>Total</span>
              <span className="text-primary">
                {formatPrice(order.total, data?.config.currencySymbol)}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Chargement...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
