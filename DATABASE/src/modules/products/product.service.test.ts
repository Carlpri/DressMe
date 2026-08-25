import { describe, it, expect, beforeEach, vi } from "vitest";
import { ProductService } from "./product.service.js";
import { ProductRepository } from "./product.repository.js";
import { ApiError } from "../../utils/api-error.js";
import { Gender, ProductStatus, Role } from "@prisma/client";
import type { CreateProductDto } from "./product.types.js";

describe("ProductService", () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeEach(() => {
    service = new ProductService();
    repository = (service as any).repository;
    vi.spyOn(repository, "findBySlug").mockResolvedValue(null);
    vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);
  });

  describe("create", () => {
    const validProductDto: CreateProductDto = {
      name: "Test Product",
      description: "A test product description",
      price: 2500,
      stock: 10,
      sku: "DM-TEST-001",
      gender: Gender.UNISEX,
      categoryIds: ["cat1"],
      brandId: "brand1",
      vendorId: "vendor1",
      status: ProductStatus.ACTIVE,
      images: [
        {
          imageUrl: "https://example.com/image.jpg",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        {
          sizeValue: "M",
          colorValue: "Red",
          stock: 5,
          sku: "DM-V1-TEST-001",
          price: 2500,
          isAvailable: true,
        },
      ],
    };

    it("should create a product with valid data for vendor user", async () => {
      const userId = "user1";
      const role = Role.VENDOR;

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);
      vi.spyOn(repository, "create").mockResolvedValue({
        id: "prod1",
        ...validProductDto,
        slug: "test-product",
      } as any);

      const result = await service.create(userId, role, validProductDto);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });

    it("should create a product with valid data for admin user", async () => {
      const userId = "admin1";
      const role = Role.ADMIN;

      vi.spyOn(repository, "findVendorById").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);
      vi.spyOn(repository, "create").mockResolvedValue({
        id: "prod1",
        ...validProductDto,
        slug: "test-product",
      } as any);

      const result = await service.create(userId, role, validProductDto);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });

    it("should throw 400 error when admin does not provide vendorId", async () => {
      const userId = "admin1";
      const role = Role.ADMIN;
      const dtoWithoutVendor = { ...validProductDto, vendorId: undefined };

      await expect(service.create(userId, role, dtoWithoutVendor as any)).rejects.toThrow(
        new ApiError(400, "vendorId is required when an admin creates a product.")
      );
    });

    it("should throw 404 error when vendor not found for admin", async () => {
      const userId = "admin1";
      const role = Role.ADMIN;

      vi.spyOn(repository, "findVendorById").mockResolvedValue(null);

      await expect(service.create(userId, role, validProductDto)).rejects.toThrow(
        new ApiError(404, "Vendor not found.")
      );
    });

    it("should throw 403 error when vendor user has no vendor profile", async () => {
      const userId = "user1";
      const role = Role.VENDOR;
      const dtoWithoutVendor = { ...validProductDto, vendorId: undefined };

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue(null);

      await expect(service.create(userId, role, dtoWithoutVendor as any)).rejects.toThrow(
        new ApiError(403, "Create a vendor profile before adding products.")
      );
    });

    it("should throw 404 error when category not found", async () => {
      const userId = "user1";
      const role = Role.VENDOR;

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue(null);

      await expect(service.create(userId, role, validProductDto)).rejects.toThrow(
        new ApiError(404, "Category not found.")
      );
    });

    it("should throw 404 error when brand not found", async () => {
      const userId = "user1";
      const role = Role.VENDOR;

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue(null);

      await expect(service.create(userId, role, validProductDto)).rejects.toThrow(
        new ApiError(404, "Brand not found.")
      );
    });

    it("should throw 409 error when product SKU already exists", async () => {
      const userId = "user1";
      const role = Role.VENDOR;

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue({
        id: "existingProd",
        sku: "DM-TEST-001",
      } as any);

      await expect(service.create(userId, role, validProductDto)).rejects.toThrow(
        new ApiError(409, "Product SKU already exists.")
      );
    });

    it("should throw 409 error when variant SKU already exists", async () => {
      const userId = "user1";
      const role = Role.VENDOR;

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue({
        id: "existingVariant",
        productId: "otherProduct",
        sku: "DM-V1-TEST-001",
      } as any);

      await expect(service.create(userId, role, validProductDto)).rejects.toThrow(
        new ApiError(409, "Variant SKU already exists.")
      );
    });

    it("should throw 409 error when duplicate product exists", async () => {
      const userId = "user1";
      const role = Role.VENDOR;

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue({
        id: "existingProd",
        name: "Test Product",
      } as any);

      await expect(service.create(userId, role, validProductDto)).rejects.toThrow(
        new ApiError(409, "A product with this name, category, and brand already exists.")
      );
    });

    it("should throw 400 error when no primary image", async () => {
      const userId = "user1";
      const role = Role.VENDOR;
      const dtoWithoutPrimaryImage = {
        ...validProductDto,
        images: [
          {
            imageUrl: "https://example.com/image.jpg",
            isPrimary: false,
            displayOrder: 0,
          },
        ],
      };

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);

      await expect(service.create(userId, role, dtoWithoutPrimaryImage)).rejects.toThrow(
        new ApiError(400, "Exactly one product image must be primary.")
      );
    });

    it("should throw 409 error when variants have duplicate size/color combinations", async () => {
      const userId = "user1";
      const role = Role.VENDOR;
      const dtoWithDuplicateVariants = {
        ...validProductDto,
        variants: [
          {
            sizeValue: "M",
            colorValue: "Red",
            stock: 5,
            sku: "DM-V1-TEST-001",
            price: 2500,
            isAvailable: true,
          },
          {
            sizeValue: "M",
            colorValue: "Red",
            stock: 10,
            sku: "DM-V2-TEST-001",
            price: 2500,
            isAvailable: true,
          },
        ],
      };

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);

      await expect(service.create(userId, role, dtoWithDuplicateVariants)).rejects.toThrow(
        new ApiError(409, "Variants cannot have duplicate size and color combinations.")
      );
    });

    it("should accept variants with only sizeValue (colorValue optional)", async () => {
      const userId = "user1";
      const role = Role.VENDOR;
      const dtoWithSizeOnly = {
        ...validProductDto,
        variants: [
          {
            sizeValue: "M",
            colorValue: "",
            stock: 5,
            sku: "DM-V1-TEST-001",
            price: 2500,
            isAvailable: true,
          },
        ],
      };

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);
      vi.spyOn(repository, "create").mockResolvedValue({
        id: "prod1",
        ...dtoWithSizeOnly,
        slug: "test-product",
      } as any);

      const result = await service.create(userId, role, dtoWithSizeOnly);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });

    it("should accept variants with only colorValue (sizeValue optional)", async () => {
      const userId = "user1";
      const role = Role.VENDOR;
      const dtoWithColorOnly = {
        ...validProductDto,
        variants: [
          {
            sizeValue: "",
            colorValue: "Red",
            stock: 5,
            sku: "DM-V1-TEST-001",
            price: 2500,
            isAvailable: true,
          },
        ],
      };

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);
      vi.spyOn(repository, "create").mockResolvedValue({
        id: "prod1",
        ...dtoWithColorOnly,
        slug: "test-product",
      } as any);

      const result = await service.create(userId, role, dtoWithColorOnly);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });

    it("should accept variants with both sizeValue and colorValue", async () => {
      const userId = "user1";
      const role = Role.VENDOR;
      const dtoWithBoth = {
        ...validProductDto,
        variants: [
          {
            sizeValue: "M",
            colorValue: "Red",
            stock: 5,
            sku: "DM-V1-TEST-001",
            price: 2500,
            isAvailable: true,
          },
        ],
      };

      vi.spyOn(repository, "findVendorByUserId").mockResolvedValue({
        id: "vendor1",
        userId: "user1",
        businessName: "Test Vendor",
        location: "Nairobi",
        whatsappNumber: "+254700000000",
      } as any);

      vi.spyOn(repository, "findCategoryById").mockResolvedValue({
        id: "cat1",
        name: "Test Category",
        slug: "test-category",
      } as any);

      vi.spyOn(repository, "findBrandById").mockResolvedValue({
        id: "brand1",
        name: "Test Brand",
        slug: "test-brand",
      } as any);

      vi.spyOn(repository, "findBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findVariantBySku").mockResolvedValue(null);
      vi.spyOn(repository, "findByNameCategoryBrand").mockResolvedValue(null);
      vi.spyOn(repository, "create").mockResolvedValue({
        id: "prod1",
        ...dtoWithBoth,
        slug: "test-product",
      } as any);

      const result = await service.create(userId, role, dtoWithBoth);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });
  });
});
