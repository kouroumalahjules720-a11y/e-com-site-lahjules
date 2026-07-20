export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  image: string;
  images: string[];
  featured: boolean;
  inStock: boolean;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export type PromoType = 'percentage' | 'fixed';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  active: boolean;
  minOrder?: number;
  expiresAt?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'orange_money' | 'mtn_momo' | 'cash_on_delivery' | 'other';
  number?: string;
  instructions?: string;
  active: boolean;
  icon?: string;
}

export interface SiteConfig {
  storeName: string;
  siteTitle: string;
  tagline: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  adminPassword: string;
  logoBase64?: string;
  phone?: string;
  email?: string;
  city?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AppData {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  orders: Order[];
  promos: PromoCode[];
  payments: PaymentMethod[];
  config: SiteConfig;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
