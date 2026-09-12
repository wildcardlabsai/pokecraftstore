export type ProductCategory = 'figures' | 'display-storage' | 'keychains' | 'accessories';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  newRelease?: boolean;
  bestSeller?: boolean;
  dimensions: string;
  material: string;
  height: string;
  printTime: string;
  finish: string;
  recommendedAge: string;
  careInstructions: string;
  tags: string[];
  variants?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'best-selling';

export interface FilterState {
  category: ProductCategory | 'all';
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  searchQuery: string;
  sortBy: SortOption;
}

export interface ShippingMethod {
  id: 'standard' | 'express';
  name: string;
  price: number;
  estimatedDelivery: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  country: string;
  phone?: string;
  shippingMethodId: 'standard' | 'express';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

export interface PlacedOrder {
  orderNumber: string;
  date: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  estimatedDelivery: string;
}
