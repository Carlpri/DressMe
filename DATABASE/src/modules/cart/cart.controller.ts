import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { CartService } from "./cart.service.js";

const cartService = new CartService();

export class CartController {
  getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.userId);

    ApiResponse.success(
      res,
      200,
      "Cart retrieved successfully.",
      cart
    );
  });

  addItem = asyncHandler(async (req, res) => {
    const cart = await cartService.addItem(
      req.user.userId,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Item added to cart successfully.",
      cart
    );
  });

  updateItem = asyncHandler(async (req, res) => {
    const cart = await cartService.updateItem(
      req.user.userId,
      req.params.itemId as string,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Cart item updated successfully.",
      cart
    );
  });

  removeItem = asyncHandler(async (req, res) => {
    const cart = await cartService.removeItem(
      req.user.userId,
      req.params.itemId as string
    );

    ApiResponse.success(
      res,
      200,
      "Cart item removed successfully.",
      cart
    );
  });

  clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user.userId);

    ApiResponse.success(
      res,
      200,
      "Cart cleared successfully.",
      cart
    );
  });
}
