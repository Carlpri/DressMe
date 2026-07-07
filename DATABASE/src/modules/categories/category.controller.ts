import { CategoryService } from "./category.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";

const categoryService = new CategoryService();

export class CategoryController {
  createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.create(req.body);

    ApiResponse.success(
      res,
      201,
      "Category created successfully.",
      category
    );
  });

  getCategories = asyncHandler(async (_req, res) => {
    const categories = await categoryService.getAll();

    ApiResponse.success(
      res,
      200,
      "Categories retrieved successfully.",
      categories
    );
  });

  getCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.getBySlug(
      req.params.slug as string
    );

    ApiResponse.success(
      res,
      200,
      "Category retrieved successfully.",
      category
    );
  });

  updateCategory = asyncHandler(async (req, res) => {
    console.log(req.params);
    
    const category = await categoryService.update(
      req.params.id as string,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Category updated successfully.",
      category
    );
  });

  deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.delete(req.params.id as string);

    ApiResponse.success(
      res,
      200,
      "Category deleted successfully.",
      null
    );
  });
}