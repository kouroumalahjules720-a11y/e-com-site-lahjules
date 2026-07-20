'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { PaymentMethod } from '@/lib/types';
import { useData } from '@/lib/context';
import { generateId } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AdminPaymentsPage() {
  const { data, updateData } = useData();
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<PaymentMethod, 'id'>>({
    name: '',
    type: 'orange_money',
    number: '',
    instructions: '',
    active: true,
  });

  if (!data) return null;

  const openNew = () => {
    setForm({
      name: '',
      type: 'orange_money',
      number: '',
      instructions: '',
      active: true,
    });
    setIsNew(true);
    setEditing(null);
  };

  const openEdit = (payment: PaymentMethod) => {
    setForm({
      name: payment.name,
      type: payment.type,
      number: payment.number,
      instructions: payment.instructions,
      active: payment.active,
    });
    setEditing(payment);
    setIsNew(false);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const payment: PaymentMethod = {
      ...form,
      id: editing?.id || generateId('pay'),
    };

    let payments: PaymentMethod[];
    if (isNew) {
      payments = [...data.payments, payment];
    } else {
      payments = data.payments.map((p) => (p.id === payment.id ? payment : p));
    }

    updateData({ ...data, payments });
    setIsNew(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer ce moyen de paiement ?')) return;
    updateData({ ...data, payments: data.payments.filter((p) => p.id !== id) });
  };

  const toggleActive = (payment: PaymentMethod) => {
    updateData({
      ...data,
      payments: data.payments.map((p) =>
        p.id === payment.id ? { ...p, active: !p.active } : p
      ),
    });
  };

  const typeLabels: Record<string, string> = {
    orange_money: 'Orange Money',
    mtn_momo: 'MTN MoMo',
    cash_on_delivery: 'Paiement à la livraison',
    other: 'Autre',
  };

  const showForm = isNew || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Moyens de paiement</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {isNew ? 'Nouveau moyen de paiement' : 'Modifier'}
            </h2>
            <button onClick={() => { setIsNew(false); setEditing(null); }}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom affiché"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as PaymentMethod['type'],
                })
              }
              options={[
                { value: 'orange_money', label: 'Orange Money' },
                { value: 'mtn_momo', label: 'MTN MoMo' },
                { value: 'cash_on_delivery', label: 'Paiement à la livraison' },
                { value: 'other', label: 'Autre' },
              ]}
            />
            {form.type !== 'cash_on_delivery' && (
              <Input
                label="Numéro"
                value={form.number || ''}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="Ex: 627081650"
              />
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Instructions
              </label>
              <textarea
                value={form.instructions || ''}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary/40"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="rounded"
              />
              Actif
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave}>Enregistrer</Button>
            <Button variant="ghost" onClick={() => { setIsNew(false); setEditing(null); }}>
              Annuler
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {data.payments.map((payment) => (
          <Card key={payment.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{payment.name}</span>
                  <Badge variant={payment.active ? 'success' : 'default'}>
                    {payment.active ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Badge variant="info">{typeLabels[payment.type]}</Badge>
                </div>
                {payment.number && (
                  <p className="text-sm text-gray-500 mt-1">N° {payment.number}</p>
                )}
                {payment.instructions && (
                  <p className="text-sm text-gray-400 mt-1">{payment.instructions}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleActive(payment)}>
                  {payment.active ? 'Désactiver' : 'Activer'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(payment)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(payment.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
