'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Facebook } from 'lucide-react';
import { useData } from '@/lib/context';
import { buildFacebookAdLink } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function AdminFacebookPage() {
  const { data } = useData();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('product_ad');
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const product = data.products.find((p) => p.id === selectedProduct);
  const siteUrl =
    baseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://votre-site.netlify.app');

  const adLink = product
    ? buildFacebookAdLink(siteUrl, product.slug, 'facebook', 'cpc', utmCampaign)
    : '';

  const copyLink = () => {
    if (!adLink) return;
    navigator.clipboard.writeText(adLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Facebook className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lancer une pub Facebook</h1>
          <p className="text-gray-500 text-sm">
            Générez un lien produit optimisé pour vos campagnes Facebook Ads
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Configuration</h2>

          <div className="space-y-4">
            <Input
              label="URL de votre site"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={siteUrl}
            />
            <Select
              label="Produit à promouvoir"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              options={[
                { value: '', label: 'Choisir un produit...' },
                ...data.products.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
            <Input
              label="Nom de la campagne (UTM)"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="product_ad"
            />
          </div>
        </Card>

        {product && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Aperçu de l&apos;annonce</h2>

            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 bg-gray-50">
                <p className="text-xs text-gray-400 uppercase">{siteUrl.replace(/https?:\/\//, '')}</p>
                <h3 className="font-bold text-gray-900 mt-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <p className="text-accent font-bold mt-2">
                  {formatPrice(product.price, data.config.currencySymbol)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Lien généré :</p>
              <p className="text-sm text-gray-800 break-all font-mono">{adLink}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={copyLink} className="flex-1">
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier le lien
                  </>
                )}
              </Button>
              <a href={adLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4" />
                  Tester
                </Button>
              </a>
            </div>
          </Card>
        )}
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Guide rapide Facebook Ads</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Sélectionnez le produit à promouvoir ci-dessus</li>
          <li>Copiez le lien généré avec les paramètres UTM</li>
          <li>Dans Facebook Ads Manager, créez une campagne &quot;Trafic&quot; ou &quot;Conversions&quot;</li>
          <li>Collez le lien dans le champ URL de destination de votre annonce</li>
          <li>Utilisez l&apos;image et la description du produit pour votre créatif publicitaire</li>
          <li>Suivez les conversions via les paramètres UTM dans vos statistiques</li>
        </ol>
      </Card>
    </div>
  );
}
