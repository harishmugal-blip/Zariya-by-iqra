// Core domain types for ZARIYA luxury store

export type Currency = "INR";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  location?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  price: number;
  compareAtPrice?: number;
  currency: Currency;
  category: string;
  collection: string;
  fabric: string;
  fabricDetails: FabricDetail[];
  colors: ProductColor[];
  sizes: string[];
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  badges: ProductBadge[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  limitedEdition: boolean;
  stock: number;
  sku: string;
  careInstructions: string;
  shippingInfo: string;
  tags: string[];
  videoUrl?: string;
}

export interface FabricDetail {
  label: string;
  value: string;
}

export type ProductBadge =
  | "new"
  | "bestseller"
  | "limited"
  | "sale"
  | "exclusive"
  | "handcrafted";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  icon: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  description: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  product: string;
}

export interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export interface CelebrityItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  productSlug: string;
  productName: string;
}

export interface SizeRow {
  size: string;
  bust: string;
  waist: string;
  hip: string;
  length: string;
}

export interface SizeChart {
  category: string;
  unit: "inches";
  note: string;
  rows: SizeRow[];
}

export interface PackagingFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Heritage" | "Craft" | "Style" | "Journal" | "People";
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  body: string[];
  productSlugs?: string[];
}
