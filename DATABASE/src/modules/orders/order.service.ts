import { ProductStatus, Role } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import prisma from "../../config/prisma.js";
import { OrderRepository } from "./order.repository.js";
import type { CreateOrderDto } from "./order.types.js";

export class OrderService {
  private repository = new OrderRepository();

  async checkout(userId: string, data: CreateOrderDto) {
    const cart = await this.repository.findCartByUserId(userId);

    if (!cart) {
      throw new ApiError(404, "Cart not found.");
    }

    if (!cart.items || cart.items.length === 0) {
      throw new ApiError(400, "Your cart is empty.");
    }

    const address = await this.repository.findAddressById(data.addressId);

    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found.");
    }

    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      variantId?: string;
      productName: string;
      productImage: string;
      variantName?: string;
      price: number;
      quantity: number;
      subtotal: number;
    }> = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        throw new ApiError(400, "One or more cart items are invalid.");
      }

      if (product.status !== ProductStatus.ACTIVE) {
        throw new ApiError(400, `Product "${product.name}" is not available.`);
      }

      const availableStock = this.getAvailableStock(
        product,
        cartItem.variantId ?? undefined
      );

      if (cartItem.quantity > availableStock) {
        throw new ApiError(
          400,
          `Insufficient stock for "${product.name}". Available: ${availableStock}.`
        );
      }

      const primaryImage = (product.images[0]?.imageUrl ?? "") as string;
      const itemSubtotal = product.price * cartItem.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        variantId: cartItem.variantId ?? undefined,
        productName: product.name,
        productImage: primaryImage,
        variantName: cartItem.variant ? `${cartItem.variant.size} / ${cartItem.variant.color}` : undefined,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });
    }

    const shippingFee = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const discount = 0;
    const total = subtotal + shippingFee + tax - discount;

    const year = new Date().getFullYear();
    const latestOrderNumber = await this.repository.findLatestOrderNumberForYear(
      year
    );
    const sequence = latestOrderNumber
      ? parseInt(latestOrderNumber.split("-")[2], 10) + 1
      : 1;
    const orderNumber = `DM-${year}-${String(sequence).padStart(6, "0")}`;

    const order = await this.repository.create({
      userId,
      addressId: data.addressId,
      orderNumber,
      subtotal,
      shippingFee,
      tax,
      discount,
      total,
      couponCode: data.couponCode,
      notes: data.notes,
      items: orderItems,
    });

    for (const item of orderItems) {
      if (item.variantId) {
        await this.repository.reduceVariantStock(item.variantId, item.quantity);
      }

      const product = cart.items.find(
        (ci) => ci.productId === item.productId
      )?.product;

      if (product && product.variants.length > 0) {
        const remainingVariants = await Promise.all(
          product.variants.map((v) =>
            this.repository.findVariantById(v.id)
          )
        );

        const newStock = remainingVariants.reduce(
          (sum: number, v: { stock: number } | null | undefined) => sum + (v?.stock ?? 0),
          0
        );

        await this.repository.updateProductStock(product.id, newStock);
      } else if (product) {
        await this.repository.updateProductStock(
          product.id,
          product.stock - item.quantity
        );
      }
    }

    await this.repository.clearCart(cart.id);

    return order;
  }

  async getMyOrders(userId: string) {
    return this.repository.findByUser(userId);
  }

  async getOrderById(userId: string, id: string, role: Role) {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ApiError(403, "You do not have permission to view this order.");
    }

    return order;
  }

  async cancelOrder(userId: string, id: string, role: Role) {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ApiError(403, "You do not have permission to cancel this order.");
    }

    if (order.status !== "PENDING") {
      throw new ApiError(400, "Only pending orders can be cancelled.");
    }

    const restored = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (product) {
          if (product.variants.length > 0) {
            const newStock = product.variants.reduce(
              (sum, v) => sum + v.stock,
              0
            );
            await tx.product.update({
              where: { id: product.id },
              data: { stock: newStock },
            });
          } else {
            await tx.product.update({
              where: { id: product.id },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
          address: true,
        },
      });
    });

    return restored;
  }

  async getAllOrders() {
    return this.repository.findAll();
  }

  async updateOrderStatus(id: string, status: string) {
    if (status === "CANCELLED") {
      const order = await this.repository.findById(id);
      if (order && order.status !== "CANCELLED") {
        return this.cancelOrder(order.userId, id, Role.ADMIN);
      }
    }
    return this.repository.updateStatus(id, status);
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    return this.repository.updatePaymentStatus(id, paymentStatus);
  }

  async getVendorOrders(vendorId: string) {
    return this.repository.findByVendor(vendorId);
  }

  private getAvailableStock(
    product: { stock: number; variants: Array<{ id: string; stock: number }> },
    variantId?: string
  ): number {
    if (!variantId) {
      return product.stock;
    }

    const variant = product.variants.find((v) => v.id === variantId);

    if (!variant) {
      throw new ApiError(400, "Invalid product variant.");
    }

    return variant.stock;
  }

  private calculateShipping(subtotal: number): number {
    if (subtotal >= 2000) {
      return 0;
    }

    return subtotal >= 1000 ? 150 : 250;
  }

  private calculateTax(subtotal: number): number {
    return Number((subtotal * 0.16).toFixed(2));
  }
}
