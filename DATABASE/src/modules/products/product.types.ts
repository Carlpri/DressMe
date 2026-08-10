import { Gender, ProductStatus } from "@prisma/client";

export interface ProductImageDto {
  id?: string;
  imageUrl: string;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface ProductVariantDto {
  id?: string;
  sizeId?: string;
  colorId?: string;
  sizeValue: string;
  colorValue: string;
  stock: number;
  sku: string;
  price?: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  isAvailable?: boolean;
  imageUrl?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  gender: Gender;
  categoryIds: string[];
  brandId: string;
  vendorId?: string;
  images?: ProductImageDto[];
  variants?: ProductVariantDto[];
  featured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  status?: ProductStatus;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;
  gender?: Gender;
  categoryIds?: string[];
  brandId?: string;
  images?: ProductImageDto[];
  variants?: ProductVariantDto[];
  featured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  status?: ProductStatus;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export interface ProductFilters {
  page: number;
  limit: number;
  category?: string;
  brand?: string;
  gender?: Gender;
  status?: ProductStatus;
  featured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  priceMin?: number;
  priceMax?: number;
  size?: string;
  color?: string;
  search?: string;
  sort: "newest" | "oldest" | "price_asc" | "price_desc" | "popular" | "rating";
}
