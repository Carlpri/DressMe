export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  featured: boolean;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  views: number;
  sales: number;
  averageRating: number;
  reviewCount: number;
  gender: "MALE" | "FEMALE" | "UNISEX";
  vendor: {
    id: string;
    shopName: string;
    logo?: string;
    verified: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  };
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
  size: string;
  color: string;
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
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  featured?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
}
