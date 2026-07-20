'use client';

import { Package, ShoppingCart, Tag, TrendingUp } from 'lucide-react';
import { useData } from '@/lib/context';
import { formatPrice } from '@/lib/storage';
import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  const { data, loading } = useData();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Produits',
      value: data.products.length,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Commandes',
      value: data.orders.length,
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Codes promo actifs',
      value: data.promos.filter((p) => p.active).length,
      icon: Tag,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Chiffre d\'affaires',
      value: formatPrice(
        data.orders.reduce((sum, o) => sum + o.total, 0),
        data.config.currencySymbol || 'GNF'
      ),
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const recentOrders = data.orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
      <p className="text-gray-500 mb-6">LOYAL FRIENDS STORE — Vue d&apos;ensemble</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Commandes récentes</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune commande pour le moment</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-500">Code</th>
                  <th className="text-left py-2 font-medium text-gray-500">Client</th>
                  <th className="text-left py-2 font-medium text-gray-500">Total</th>
                  <th className="text-left py-2 font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium">{order.code}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3">
                      {formatPrice(order.total, data.config.currencySymbol || 'GNF')}
                    </td>
                    <td className="py-3 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="mt-6 p-4 bg-primary-light border border-primary/20 rounded-xl text-sm text-primary">
        <strong>Note :</strong> Les modifications sont sauvegardées dans le localStorage du
        navigateur. Utilisez &quot;Exporter JSON&quot; pour sauvegarder vos données et
        remplacer les fichiers dans <code className="bg-white px-1 rounded border border-primary/20">public/data/</code> avant
        un redéploiement.
      </div>
    </div>
  );
}
