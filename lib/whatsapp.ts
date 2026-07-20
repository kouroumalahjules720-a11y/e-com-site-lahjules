import type { CartItem, Order, SiteConfig } from './types';
import { formatPrice } from './storage';

/** Numéro WhatsApp Guinée (LOYAL FRIENDS STORE) */
export const DEFAULT_WHATSAPP = '224627081650';

export function getWhatsAppNumber(config?: SiteConfig | null): string {
  const raw = config?.whatsappNumber?.replace(/\D/g, '') || '';
  // Ancien numéro Cameroun ou vide → numéro Guinée
  if (!raw || raw.startsWith('237')) {
    return DEFAULT_WHATSAPP;
  }
  return raw;
}

export function buildWhatsAppUrl(
  phone: string,
  message: string
): string {
  let cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.startsWith('237')) {
    cleanPhone = DEFAULT_WHATSAPP;
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function buildCartWhatsAppMessage(
  cart: CartItem[],
  config: SiteConfig,
  options?: {
    customerName?: string;
    customerPhone?: string;
    promoCode?: string;
    discount?: number;
    paymentMethod?: string;
    orderCode?: string;
  }
): string {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = options?.discount ?? 0;
  const total = subtotal - discount;

  let message = `🛒 *Nouvelle commande - ${config.storeName}*\n\n`;

  if (options?.orderCode) {
    message += `📋 Code commande: *${options.orderCode}*\n\n`;
  }

  if (options?.customerName) {
    message += `👤 Client: ${options.customerName}\n`;
  }
  if (options?.customerPhone) {
    message += `📱 Téléphone: ${options.customerPhone}\n`;
  }

  message += `\n*Articles:*\n`;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Qté: ${item.quantity} × ${formatPrice(item.price, config.currencySymbol)}\n`;
    message += `   Sous-total: ${formatPrice(item.price * item.quantity, config.currencySymbol)}\n`;
  });

  message += `\n*Récapitulatif:*\n`;
  message += `Sous-total: ${formatPrice(subtotal, config.currencySymbol)}\n`;

  if (discount > 0 && options?.promoCode) {
    message += `Code promo (${options.promoCode}): -${formatPrice(discount, config.currencySymbol)}\n`;
  }

  message += `*Total: ${formatPrice(total, config.currencySymbol)}*\n`;

  if (options?.paymentMethod) {
    message += `\n💳 Paiement: ${options.paymentMethod}\n`;
  }

  message += `\nMerci pour votre commande ! 🙏`;

  return message;
}

export function buildSingleProductWhatsAppMessage(
  productName: string,
  price: number,
  config: SiteConfig
): string {
  return (
    `Bonjour, je souhaite commander :\n\n` +
    `📦 *${productName}*\n` +
    `💰 Prix: ${formatPrice(price, config.currencySymbol)}\n\n` +
    `Merci !`
  );
}

export function buildFacebookAdLink(
  baseUrl: string,
  productSlug: string,
  utmSource = 'facebook',
  utmMedium = 'cpc',
  utmCampaign = 'product_ad'
): string {
  const url = new URL(`${baseUrl}/product/${productSlug}/`);
  url.searchParams.set('utm_source', utmSource);
  url.searchParams.set('utm_medium', utmMedium);
  url.searchParams.set('utm_campaign', utmCampaign);
  return url.toString();
}

export function getOrderTrackingMessage(order: Order, config: SiteConfig): string {
  const statusLabels: Record<string, string> = {
    pending: '⏳ En attente de confirmation',
    confirmed: '✅ Commande confirmée',
    processing: '📦 En préparation',
    shipped: '🚚 Expédiée',
    delivered: '🎉 Livrée',
    cancelled: '❌ Annulée',
  };

  return (
    `Commande *${order.code}*\n` +
    `Statut: ${statusLabels[order.status] || order.status}\n` +
    `Total: ${formatPrice(order.total, config.currencySymbol)}\n` +
    `Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`
  );
}
