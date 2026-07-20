'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { PromoCode } from '@/lib/types';
import { useData } from '@/lib/context';
import { generateId } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AdminPromosPage() {
  const { data, updateData } = useData();
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<PromoCode, 'id'>>({
    code: '',
    type: 'percentage',
    value: 10,
    active: true,
  });

  if (!data) return null;

  const openNew = () => {
    setForm({ code: '', type: 'percentage', value: 10, active: true });
    setIsNew(true);
    setEditing(null);
  };

  const openEdit = (promo: PromoCode) => {
    setForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      active: promo.active,
      minOrder: promo.minOrder,
      expiresAt: promo.expiresAt,
    });
    setEditing(promo);
    setIsNew(false);
  };

  const handleSave = () => {
    if (!form.code.trim()) return;

    const promo: PromoCode = {
      ...form,
      id: editing?.id || generateId('promo'),
      code: form.code.toUpperCase(),
    };

    let promos: PromoCode[];
    if (isNew) {
      promos = [...data.promos, promo];
    } else {
      promos = data.promos.map((p) => (p.id === promo.id ? promo : p));
    }

    updateData({ ...data, promos });
    setIsNew(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer ce code promo ?')) return;
    updateData({ ...data, promos: data.promos.filter((p) => p.id !== id) });
  };

  const toggleActive = (promo: PromoCode) => {
    updateData({
      ...data,
      promos: data.promos.map((p) =>
        p.id === promo.id ? { ...p, active: !p.active } : p
      ),
    });
  };

  const showForm = isNew || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Codes promo</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          Créer
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {isNew ? 'Nouveau code promo' : 'Modifier le code'}
            </h2>
            <button onClick={() => { setIsNew(false); setEditing(null); }}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="Ex: WELCOME10"
            />
            <Select
              label="Type de réduction"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })
              }
              options={[
                { value: 'percentage', label: 'Pourcentage (%)' },
                { value: 'fixed', label: 'Montant fixe (GNF)' },
              ]}
            />
            <Input
              label={form.type === 'percentage' ? 'Pourcentage' : 'Montant (GNF)'}
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
            <Input
              label="Commande minimum (optionnel)"
              type="number"
              value={form.minOrder || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  minOrder: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <Input
              label="Date d'expiration (optionnel)"
              type="date"
              value={form.expiresAt || ''}
              onChange={(e) =>
                setForm({ ...form, expiresAt: e.target.value || undefined })
              }
            />
            <label className="flex items-center gap-2 text-sm self-end pb-2">
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
        {data.promos.map((promo) => (
          <Card key={promo.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{promo.code}</span>
                  <Badge variant={promo.active ? 'success' : 'default'}>
                    {promo.active ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {promo.type === 'percentage'
                    ? `${promo.value}% de réduction`
                    : `${promo.value} GNF de réduction`}
                  {promo.minOrder && ` · Min. ${promo.minOrder} GNF`}
                  {promo.expiresAt && ` · Expire le ${promo.expiresAt}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleActive(promo)}>
                  {promo.active ? 'Désactiver' : 'Activer'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(promo)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(promo.id)}>
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
