'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useData } from '@/lib/context';
import { generateId, slugify, formatPrice } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  slug: '',
  description: '',
  longDescription: '',
  price: 0,
  categoryId: '',
  image: '',
  images: [],
  featured: false,
  inStock: true,
  tags: [],
};

export default function AdminProductsPage() {
  const { data, updateData } = useData();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [priceError, setPriceError] = useState('');

  if (!data) return null;

  const openNew = () => {
    setForm({ ...emptyProduct, categoryId: data.categories[0]?.id || '' });
    setIsNew(true);
    setEditing(null);
    setPriceError('');
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      categoryId: product.categoryId,
      image: product.image,
      images: product.images,
      featured: product.featured,
      inStock: product.inStock,
      tags: product.tags,
    });
    setEditing(product);
    setIsNew(false);
    setPriceError('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setForm((prev) => ({
        ...prev,
        image: result,
        images: [result],
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Le nom du produit est requis');
      return;
    }
    if (!form.longDescription.trim()) {
      alert('La description longue est requise');
      return;
    }
    if (!Number.isFinite(form.price) || form.price <= 0) {
      setPriceError('Le prix doit être un nombre positif en GNF');
      return;
    }
    if (!form.categoryId) {
      alert('Sélectionnez une catégorie');
      return;
    }
    if (!form.image) {
      alert('Uploadez une image produit');
      return;
    }

    const slug = form.slug || slugify(form.name);
    const shortDesc =
      form.description.trim() ||
      form.longDescription.trim().slice(0, 120);

    const product: Product = {
      ...form,
      id: editing?.id || generateId('prod'),
      slug,
      description: shortDesc,
      images: form.images.length ? form.images : [form.image],
      inStock: true,
    };

    let products: Product[];
    if (isNew) {
      products = [...data.products, product];
    } else {
      products = data.products.map((p) => (p.id === product.id ? product : p));
    }

    updateData({ ...data, products });
    setEditing(null);
    setIsNew(false);
    setPriceError('');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    updateData({
      ...data,
      products: data.products.filter((p) => p.id !== id),
    });
  };

  const showForm = isNew || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500 mt-1">
            Les ajouts apparaissent tout de suite dans le catalogue (localStorage)
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          Ajouter produit
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {isNew ? 'Ajouter un produit' : 'Modifier le produit'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsNew(false);
                setEditing(null);
                setPriceError('');
              }}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Nom du produit"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Sac en cuir artisanal"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description longue
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                rows={4}
                required
                placeholder="Décrivez le produit en détail..."
                className="w-full px-4 py-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary/40"
              />
            </div>

            <Input
              label="Prix en GNF"
              type="number"
              min={1}
              step={1}
              value={form.price || ''}
              onChange={(e) => {
                setForm({ ...form, price: Number(e.target.value) });
                setPriceError('');
              }}
              placeholder="Ex: 50000"
              error={priceError}
              required
            />

            <Select
              label="Catégorie"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={[
                { value: '', label: 'Choisir une catégorie...' },
                ...data.categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Upload image produit
              </label>
              <div className="flex items-center gap-4">
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image}
                    alt=""
                    className="w-24 h-24 rounded-[12px] object-cover border border-primary/20"
                  />
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary/20 rounded-xl text-sm text-primary hover:bg-primary-light transition-colors">
                    <Upload className="w-4 h-4" />
                    {form.image ? 'Changer l\'image' : 'Choisir une image'}
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                L&apos;image est stockée en base64 dans les données locales (products)
              </p>
            </div>

            {!isNew && (
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded"
                  />
                  Produit phare
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="rounded"
                  />
                  En stock
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} variant="cta">
              Enregistrer
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsNew(false);
                setEditing(null);
                setPriceError('');
              }}
            >
              Annuler
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {data.products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt=""
                className="w-14 h-14 rounded-[12px] object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatPrice(product.price, data.config.currencySymbol || 'GNF')}
                  {product.featured && ' · Phare'}
                  {!product.inStock && ' · Rupture'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
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
