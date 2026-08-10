import { ProductStatus, Role } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import prisma from "../../config/prisma.js";
import { randomUUID } from "node:crypto";
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

      if (!cartItem.variant?.isAvailable) {
        throw new ApiError(400, `Product "${product.name}" is unavailable.`);
      }

      const unitPrice = cartItem.variant.price ?? product.price;
      const primaryImage = product.images[0]?.imageUrl ?? "";
      const itemSubtotal = unitPrice * cartItem.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        variantId: cartItem.variantId ?? undefined,
        productName: product.name,
        productImage: primaryImage,
        variantName: cartItem.variant ? `${cartItem.variant.sizeValue ?? ""} / ${cartItem.variant.colorValue ?? ""}`.trim() : undefined,
        price: unitPrice,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });
    }

    const shippingFee = this.calculateShipping(subtotal);
    const tax = this.calculateTax(subtotal);
    const discount = 0;
    const total = subtotal + shippingFee + tax - discount;

    const year = new Date().getFullYear();
    const orderNumber = `DM-${year}-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;

    let order;
    try {
      order = await this.repository.createWithStockReservation({
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
      cartId: cart.id,
    });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Insufficient stock")) {
        throw new ApiError(400, "One or more variants are no longer available in the requested quantity.");
      }
      throw error;
    }

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

    const restored = await prisma.$transaction(async (tx) => {
      const cancellation = await tx.order.updateMany({
        where: { id, status: "PENDING" },
        data: { status: "CANCELLED" },
      });

      if (cancellation.count !== 1) {
        throw new ApiError(400, "Only pending orders can be cancelled.");
      }

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
      }

      return tx.order.findUniqueOrThrow({
        where: { id },
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

  async getVendorOrders(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } });
    if (!vendor) throw new ApiError(403, "Vendor profile not found.");
    return this.repository.findByVendor(vendor.id);
  }

  private getAvailableStock(
    product: { variants: Array<{ id: string; stock: number }> },
    variantId?: string
  ): number {
    if (!variantId) {
      throw new ApiError(400, "Variant selection is required.");
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
