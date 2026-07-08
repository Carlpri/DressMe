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
  size: string;
  color: string;
  stock: number;
  sku: string;
  price?: number;
  imageUrl?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  gender: Gender;
  categoryId: string;
  brandId: string;
  vendorId?: string;
  images?: ProductImageDto[];
  variants?: ProductVariantDto[];
  featured?: boolean;
  status?: ProductStatus;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  gender?: Gender;
  categoryId?: string;
  brandId?: string;
  images?: ProductImageDto[];
  variants?: ProductVariantDto[];
  featured?: boolean;
  status?: ProductStatus;
}

export interface ProductFilters {
  page: number;
  limit: number;
  category?: string;
  brand?: string;
  gender?: Gender;
  status?: ProductStatus;
  featured?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
}
