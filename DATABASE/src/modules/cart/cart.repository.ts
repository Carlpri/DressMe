import prisma from "../../config/prisma.js";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: true,
          brand: true,
          category: true,
          vendor: {
            select: {
              id: true,
              shopName: true,
              phone: true,
            },
          },
        },
      },
      variant: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} as const;

export class CartRepository {
  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  async findOrCreateCart(userId: string) {
    const cart = await this.findCartByUserId(userId);

    if (cart) {
      return cart;
    }

    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  async findProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });
  }

  async findVariantById(id: string) {
    return prisma.productVariant.findUnique({
      where: { id },
    });
  }

  async findCartItemById(id: string) {
    return prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: true,
        variant: true,
      },
    });
  }

  async findCartItem(
    cartId: string,
    productId: string,
    variantId?: string
  ) {
    return prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId ?? null,
      },
    });
  }

  async addItem(
    cartId: string,
    productId: string,
    quantity: number,
    variantId?: string
  ) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        variantId,
        quantity,
      },
    });
  }

  async updateItemQuantity(
    itemId: string,
    quantity: number
  ) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async deleteItem(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
