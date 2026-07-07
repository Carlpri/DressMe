import slugify from "slugify";
import { ApiError } from "../../utils/api-error.js";
import { CategoryRepository } from "./category.repository.js";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./category.types.js";

export class CategoryService {
  private repository = new CategoryRepository();

  async create(data: CreateCategoryDto) {
    const existing = await this.repository.findByName(data.name);

    if (existing) {
      throw new ApiError(
        409,
        "Category already exists."
      );
    }

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    return this.repository.create({
      name: data.name,
      slug,
    });
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getBySlug(slug: string) {
    const category = await this.repository.findBySlug(slug);

    if (!category) {
      throw new ApiError(
        404,
        "Category not found."
      );
    }

    return category;
  }

  async update(
    id: string,
    data: UpdateCategoryDto
  ) {
    console.log("Received ID",id);

    const category = await this.repository.findById(id);

    console.log("Found Category",category);

    if (!category) {
      throw new ApiError(
        404,
        "Category not found."
      );
    }

    const updateData: {
      name?: string;
      slug?: string;
    } = {};

    if (data.name) {
        const existing = await this.repository.findByName(data.name);

        if (existing && existing.id !== id) {
            throw new ApiError(
                409,
                "Category name already exists."
            );
        }
      updateData.name = data.name;

      updateData.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    return this.repository.update(
      id,
      updateData as {
        name: string;
        slug: string;
      }
    );
  }

  async delete(id: string) {
    const category = await this.repository.findById(id);

    if (!category) {
      throw new ApiError(
        404,
        "Category not found."
      );
    }

    await this.repository.delete(id);
  }
}