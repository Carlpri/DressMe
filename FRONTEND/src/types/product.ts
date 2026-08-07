export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  featured: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "HIDDEN";
  views: number;
  sales: number;
  averageRating: number;
  reviewCount: number;
  gender: "MALE" | "FEMALE" | "UNISEX";
  vendor: {
    id: string;
    businessName: string;
    whatsappNumber: string;
    logo?: string;
    isVerified: boolean;
  };
  categories: CategorySummary[];
  brand: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  altText?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  sizeValue: string;
  colorValue: string;
  stock: number;
  sku: string;
  price?: number;
  imageUrl?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  gender?: "MALE" | "FEMALE" | "UNISEX";
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED" | "HIDDEN";
  featured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  priceMin?: number;
  priceMax?: number;
  size?: string;
  color?: string;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular" | "rating";
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
}
