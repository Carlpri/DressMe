import { Gender, ProductStatus, Role } from "@prisma/client";
import slugify from "slugify";
import { ApiError } from "../../utils/api-error.js";
import { ProductRepository } from "./product.repository.js";
import type {
  CreateProductDto,
  ProductFilters,
  ProductImageDto,
  ProductVariantDto,
  UpdateProductDto,
} from "./product.types.js";

export class ProductService {
  private repository = new ProductRepository();

  async create(
    userId: string,
    role: Role,
    data: CreateProductDto
  ) {
    const vendorId = await this.resolveVendorId(
      userId,
      role,
      data.vendorId
    );

    await this.ensureRelationsExist(data.categoryId, data.brandId);
    await this.ensureSkuAvailable(data.sku);
    await this.ensureVariantSkusAvailable(data.variants);
    this.ensureOnePrimaryImage(data.images);
    this.ensureUniqueVariantOptions(data.variants);

    const slug = await this.createUniqueSlug(data.name);
    const productData = {
      ...data,
      stock: this.resolveStock(data.stock, data.variants),
    };

    return this.repository.create(vendorId, slug, productData);
  }

  async getAll(query: Record<string, unknown>) {
    return this.repository.findAll(this.parseFilters(query));
  }

  async getBySlug(slug: string) {
    const product = await this.repository.findActiveBySlug(slug);

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    return product;
  }

  async update(
    id: string,
    userId: string,
    role: Role,
    data: UpdateProductDto
  ) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    await this.ensureCanManageProduct(userId, role, product.vendorId);

    if (data.categoryId || data.brandId) {
      await this.ensureRelationsExist(
        data.categoryId ?? product.categoryId,
        data.brandId ?? product.brandId
      );
    }

    if (data.sku && data.sku !== product.sku) {
      await this.ensureSkuAvailable(data.sku, id);
    }

    await this.ensureVariantSkusAvailable(data.variants, id);
    this.ensureOnePrimaryImage(data.images);
    this.ensureUniqueVariantOptions(data.variants);

    const updateData: UpdateProductDto & {
      slug?: string;
    } = {
      ...data,
    };

    if (data.name && data.name !== product.name) {
      updateData.slug = await this.createUniqueSlug(data.name, id);
    }

    if (data.variants) {
      if (data.variants.length > 0) {
        updateData.stock = this.sumVariantStock(data.variants);
      }
    } else if (product.variants.length > 0) {
      updateData.stock = this.sumVariantStock(product.variants);
    }

    return this.repository.update(id, updateData);
  }

  async delete(
    id: string,
    userId: string,
    role: Role
  ) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    await this.ensureCanManageProduct(userId, role, product.vendorId);

    await this.repository.softDelete(id);
  }

  private async resolveVendorId(
    userId: string,
    role: Role,
    vendorId?: string
  ) {
    if (role === Role.ADMIN) {
      if (!vendorId) {
        throw new ApiError(
          400,
          "vendorId is required when an admin creates a product."
        );
      }

      const vendor = await this.repository.findVendorById(vendorId);

      if (!vendor) {
        throw new ApiError(404, "Vendor not found.");
      }

      return vendor.id;
    }

    const vendor = await this.repository.findVendorByUserId(userId);

    if (!vendor) {
      throw new ApiError(403, "Create a vendor profile before adding products.");
    }

    return vendor.id;
  }

  private async ensureRelationsExist(
    categoryId: string,
    brandId: string
  ) {
    const [category, brand] = await Promise.all([
      this.repository.findCategoryById(categoryId),
      this.repository.findBrandById(brandId),
    ]);

    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    if (!brand) {
      throw new ApiError(404, "Brand not found.");
    }
  }

  private async ensureCanManageProduct(
    userId: string,
    role: Role,
    vendorId: string
  ) {
    if (role === Role.ADMIN) {
      return;
    }

    const vendor = await this.repository.findVendorByUserId(userId);

    if (!vendor || vendor.id !== vendorId) {
      throw new ApiError(403, "You can only manage your own products.");
    }
  }

  private async ensureSkuAvailable(
    sku: string,
    currentProductId?: string
  ) {
    const product = await this.repository.findBySku(sku);

    if (product && product.id !== currentProductId) {
      throw new ApiError(409, "Product SKU already exists.");
    }
  }

  private async ensureVariantSkusAvailable(
    variants?: ProductVariantDto[],
    currentProductId?: string
  ) {
    if (!variants) {
      return;
    }

    const duplicateSku = variants.find(
      (variant, index) =>
        variants.findIndex((item) => item.sku === variant.sku) !== index
    );

    if (duplicateSku) {
      throw new ApiError(409, "Variant SKUs must be unique.");
    }

    for (const variant of variants) {
      const existing = await this.repository.findVariantBySku(variant.sku);

      if (existing && existing.productId !== currentProductId) {
        throw new ApiError(409, "Variant SKU already exists.");
      }
    }
  }

  private ensureOnePrimaryImage(images?: ProductImageDto[]) {
    if (!images) {
      return;
    }

    const primaryCount = images.filter(
      (image) => image.isPrimary === true
    ).length;

    if (primaryCount !== 1) {
      throw new ApiError(400, "Exactly one product image must be primary.");
    }
  }

  private ensureUniqueVariantOptions(variants?: ProductVariantDto[]) {
    if (!variants) {
      return;
    }

    const keys = variants.map(
      (variant) =>
        `${variant.size.trim().toLowerCase()}::${variant.color.trim().toLowerCase()}`
    );

    if (new Set(keys).size !== keys.length) {
      throw new ApiError(
        409,
        "Variants cannot have duplicate size and color combinations."
      );
    }
  }

  private resolveStock(
    productStock: number,
    variants?: ProductVariantDto[]
  ) {
    if (variants && variants.length > 0) {
      return this.sumVariantStock(variants);
    }

    return productStock;
  }

  private sumVariantStock(
    variants: Array<{ stock: number }>
  ) {
    return variants.reduce(
      (total, variant) => total + variant.stock,
      0
    );
  }

  private parseFilters(query: Record<string, unknown>): ProductFilters {
    return {
      page: this.parsePositiveInt(query.page, 1),
      limit: Math.min(this.parsePositiveInt(query.limit, 20), 100),
      category: this.parseString(query.category),
      brand: this.parseString(query.brand),
      gender: this.parseEnum(query.gender, Gender),
      status: this.parseEnum(query.status, ProductStatus),
      featured: this.parseBoolean(query.featured),
      isTrending: this.parseBoolean(query.isTrending),
      isNewArrival: this.parseBoolean(query.isNewArrival),
      isBestSeller: this.parseBoolean(query.isBestSeller),
      priceMin: this.parseNumber(query.priceMin),
      priceMax: this.parseNumber(query.priceMax),
      size: this.parseString(query.size),
      color: this.parseString(query.color),
      search: this.parseString(query.search),
      sort: this.parseSort(query.sort),
    };
  }

  private parseString(value: unknown) {
    return typeof value === "string" && value.trim()
      ? value.trim()
      : undefined;
  }

  private parsePositiveInt(
    value: unknown,
    fallback: number
  ) {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      return fallback;
    }

    return parsed;
  }

  private parseNumber(value: unknown) {
    if (value === undefined) {
      return undefined;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private parseBoolean(value: unknown) {
    if (value === undefined) {
      return undefined;
    }

    if (value === true || value === "true") {
      return true;
    }

    if (value === false || value === "false") {
      return false;
    }

    return undefined;
  }

  private parseEnum<T extends Record<string, string>>(
    value: unknown,
    values: T
  ): T[keyof T] | undefined {
    if (typeof value !== "string") {
      return undefined;
    }

    return Object.values(values).includes(value)
      ? (value as T[keyof T])
      : undefined;
  }

  private parseSort(value: unknown): ProductFilters["sort"] {
    const allowed: ProductFilters["sort"][] = [
      "newest",
      "oldest",
      "price_asc",
      "price_desc",
      "popular",
    ];

    return typeof value === "string" &&
      allowed.includes(value as ProductFilters["sort"])
      ? (value as ProductFilters["sort"])
      : "newest";
  }

  private async createUniqueSlug(
    name: string,
    currentProductId?: string
  ) {
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.repository.findBySlug(slug);

      if (!existing || existing.id === currentProductId) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
  }
}
