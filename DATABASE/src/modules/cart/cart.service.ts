import { ProductStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { CartRepository } from "./cart.repository.js";
import type {
  AddCartItemDto,
  UpdateCartItemDto,
} from "./cart.types.js";

export class CartService {
  private repository = new CartRepository();

  async getCart(userId: string) {
    return this.repository.findOrCreateCart(userId);
  }

  async addItem(
    userId: string,
    data: AddCartItemDto
  ) {
    const cart = await this.repository.findOrCreateCart(userId);
    const product = await this.repository.findProductById(data.productId);

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    if (product.status !== ProductStatus.ACTIVE) {
      throw new ApiError(400, "Only active products can be added to cart.");
    }

    const stock = await this.getAvailableStock(
      product.id,
      product.stock,
      data.variantId
    );

    const existingItem = await this.repository.findCartItem(
      cart.id,
      data.productId,
      data.variantId
    );

    const nextQuantity =
      (existingItem?.quantity ?? 0) + data.quantity;

    this.ensureStockAvailable(nextQuantity, stock);

    if (existingItem) {
      await this.repository.updateItemQuantity(
        existingItem.id,
        nextQuantity
      );
    } else {
      await this.repository.addItem(
        cart.id,
        data.productId,
        data.quantity,
        data.variantId
      );
    }

    return this.repository.findCartByUserId(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    data: UpdateCartItemDto
  ) {
    const item = await this.repository.findCartItemById(itemId);

    if (!item || item.cart.userId !== userId) {
      throw new ApiError(404, "Cart item not found.");
    }

    const stock = await this.getAvailableStock(
      item.productId,
      item.product.stock,
      item.variantId ?? undefined
    );

    this.ensureStockAvailable(data.quantity, stock);

    await this.repository.updateItemQuantity(
      itemId,
      data.quantity
    );

    return this.repository.findCartByUserId(userId);
  }

  async removeItem(
    userId: string,
    itemId: string
  ) {
    const item = await this.repository.findCartItemById(itemId);

    if (!item || item.cart.userId !== userId) {
      throw new ApiError(404, "Cart item not found.");
    }

    await this.repository.deleteItem(itemId);

    return this.repository.findCartByUserId(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.repository.findOrCreateCart(userId);

    await this.repository.clearCart(cart.id);

    return this.repository.findCartByUserId(userId);
  }

  private async getAvailableStock(
    productId: string,
    productStock: number,
    variantId?: string
  ) {
    if (!variantId) {
      return productStock;
    }

    const variant = await this.repository.findVariantById(variantId);

    if (!variant || variant.productId !== productId) {
      throw new ApiError(400, "Product variant is invalid.");
    }

    return variant.stock;
  }

  private ensureStockAvailable(
    quantity: number,
    stock: number
  ) {
    if (quantity > stock) {
      throw new ApiError(400, "Requested quantity exceeds available stock.");
    }
  }
}
