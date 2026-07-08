import slugify from "slugify";
import { ApiError } from "../../utils/api-error.js";
import { BrandRepository } from "./brand.repository.js";
import type {
  CreateBrandDto,
  UpdateBrandDto,
} from "./brand.types.js";

export class BrandService {
  private repository = new BrandRepository();

  async create(data: CreateBrandDto) {
    const existing = await this.repository.findByName(data.name);

    if (existing) {
      throw new ApiError(
        409,
        "Brand already exists."
      );
    }

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    return this.repository.create({
      ...data,
      slug,
    });
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getBySlug(slug: string) {
    const brand = await this.repository.findBySlug(slug);

    if (!brand) {
      throw new ApiError(
        404,
        "Brand not found."
      );
    }

    return brand;
  }

  async update(
    id: string,
    data: UpdateBrandDto
  ) {
    const brand = await this.repository.findById(id);

    if (!brand) {
      throw new ApiError(
        404,
        "Brand not found."
      );
    }

    const updateData: {
      name?: string;
      slug?: string;
      logo?: string;
      website?: string;
      description?: string;
    } = {};

    if (data.name) {
      const existing = await this.repository.findByName(data.name);

      if (existing && existing.id !== id) {
        throw new ApiError(
          409,
          "Brand already exists."
        );
      }

      updateData.name = data.name;

      updateData.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (data.logo !== undefined) {
      updateData.logo = data.logo;
    }

    if (data.website !== undefined) {
      updateData.website = data.website;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    return this.repository.update(id, updateData);
  }

  async delete(id: string) {
    const brand = await this.repository.findById(id);

    if (!brand) {
      throw new ApiError(
        404,
        "Brand not found."
      );
    }

    return this.repository.delete(id);
  }
}
