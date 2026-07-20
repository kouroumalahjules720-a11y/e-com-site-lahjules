import type { AppData, CartItem, Order, PromoCode } from './types';

const STORAGE_KEYS = {
  appData: 'ecom_app_data',
  cart: 'ecom_cart',
  adminAuth: 'ecom_admin_auth',
} as const;

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export async function fetchInitialData(): Promise<AppData> {
  const [products, categories, reviews, orders, promos, payments, config] =
    await Promise.all([
      fetch('/data/products.json').then((r) => r.json()),
      fetch('/data/categories.json').then((r) => r.json()),
      fetch('/data/reviews.json').then((r) => r.json()),
      fetch('/data/orders.json').then((r) => r.json()),
      fetch('/data/promos.json').then((r) => r.json()),
      fetch('/data/payments.json').then((r) => r.json()),
      fetch('/data/config.json').then((r) => r.json()),
    ]);

  return {
    products,
    categories,
    reviews,
    orders,
    promos,
    payments,
    config,
  };
}

export function getStoredAppData(): AppData | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.appData);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return null;
  }
}

export function saveAppData(data: AppData): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.appData, JSON.stringify(data));
}

export async function loadAppData(): Promise<AppData> {
  const initial = await fetchInitialData();
  const stored = getStoredAppData();

  if (!stored) {
    if (isBrowser()) saveAppData(initial);
    return initial;
  }

  // Toujours synchroniser devise / contact / WhatsApp depuis config.json
  // pour éviter d'anciennes valeurs FCFA ou +237 en localStorage
  const merged: AppData = {
    ...stored,
    config: {
      ...stored.config,
      ...initial.config,
      // Conserver le logo uploadé par l'admin s'il existe
      logoBase64: stored.config.logoBase64 || initial.config.logoBase64 || '',
      currency: 'GNF',
      currencySymbol: 'GNF',
      whatsappNumber: initial.config.whatsappNumber || '224627081650',
    },
  };

  if (isBrowser()) saveAppData(merged);
  return merged;
}

export function getCart(): CartItem[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.cart);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  } else {
    cart = cart.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  saveCart([]);
}

export function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CMD-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function applyPromoCode(
  promos: PromoCode[],
  code: string,
  subtotal: number
): { discount: number; promo: PromoCode | null; error?: string } {
  const promo = promos.find(
    (p) => p.code.toUpperCase() === code.toUpperCase() && p.active
  );

  if (!promo) {
    return { discount: 0, promo: null, error: 'Code promo invalide' };
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { discount: 0, promo: null, error: 'Code promo expiré' };
  }

  if (promo.minOrder && subtotal < promo.minOrder) {
    return {
      discount: 0,
      promo: null,
      error: `Commande minimum de ${promo.minOrder} requise`,
    };
  }

  let discount = 0;
  if (promo.type === 'percentage') {
    discount = Math.round((subtotal * promo.value) / 100);
  } else {
    discount = Math.min(promo.value, subtotal);
  }

  return { discount, promo };
}

export function createOrder(
  data: AppData,
  order: Omit<Order, 'id' | 'createdAt'>
): { order: Order; data: AppData } {
  const newOrder: Order = {
    ...order,
    id: generateId('order'),
    createdAt: new Date().toISOString(),
  };

  const updatedData: AppData = {
    ...data,
    orders: [newOrder, ...data.orders],
  };

  saveAppData(updatedData);
  return { order: newOrder, data: updatedData };
}

export function exportDataFile(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatPrice(amount: number, symbol = 'GNF'): string {
  const currency =
    !symbol || symbol.toUpperCase() === 'FCFA' ? 'GNF' : symbol;
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
