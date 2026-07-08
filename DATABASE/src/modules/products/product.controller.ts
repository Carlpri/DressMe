import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ProductService } from "./product.service.js";

const productService = new ProductService();

export class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    const product = await productService.create(
      req.user.userId,
      req.user.role,
      req.body
    );

    ApiResponse.success(
      res,
      201,
      "Product created successfully.",
      product
    );
  });

  getProducts = asyncHandler(async (req, res) => {
    const products = await productService.getAll(req.query);

    ApiResponse.success(
      res,
      200,
      "Products retrieved successfully.",
      products
    );
  });

  getProduct = asyncHandler(async (req, res) => {
    const product = await productService.getBySlug(
      req.params.slug as string
    );

    ApiResponse.success(
      res,
      200,
      "Product retrieved successfully.",
      product
    );
  });

  updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.update(
      req.params.id as string,
      req.user.userId,
      req.user.role,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Product updated successfully.",
      product
    );
  });

  deleteProduct = asyncHandler(async (req, res) => {
    await productService.delete(
      req.params.id as string,
      req.user.userId,
      req.user.role
    );

    ApiResponse.success(
      res,
      200,
      "Product deleted successfully.",
      null
    );
  });
}
