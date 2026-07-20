'use client';

import type { OrderStatus } from '@/lib/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types';
import { useData } from '@/lib/context';
import { formatPrice } from '@/lib/storage';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';

export default function AdminOrdersPage() {
  const { data, updateData } = useData();

  if (!data) return null;

  const updateStatus = (orderId: string, status: OrderStatus) => {
    updateData({
      ...data,
      orders: data.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Commandes WhatsApp</h1>

      {data.orders.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          Aucune commande enregistrée
        </Card>
      ) : (
        <div className="space-y-4">
          {data.orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-gray-900">{order.code}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ORDER_STATUS_COLORS[order.status]
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
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
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-sm">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-1">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity, data.config.currencySymbol)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(order.total, data.config.currencySymbol)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-48">
                  <Select
                    label="Statut"
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
                    }
                    options={Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
