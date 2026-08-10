import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          brand: true,
        },
      },
      variant: true,
    },
  },
  address: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export class OrderRepository {
  async createWithStockReservation(data: {
    userId: string;
    addressId: string;
    orderNumber: string;
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    total: number;
    couponCode?: string;
    notes?: string;
    cartId: string;
    items: Array<{
      productId: string;
      variantId?: string;
      productName: string;
      productImage: string;
      variantName?: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>;
  }) {
    return prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        if (!item.variantId) {
          throw new Error("Checkout item is missing a product variant.");
        }

        const reservation = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            productId: item.productId,
            isAvailable: true,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (reservation.count !== 1) {
          throw new Error(`Insufficient stock for product ${item.productId}.`);
        }
      }

      const order = await tx.order.create({
        data: {
          userId: data.userId,
          addressId: data.addressId,
          orderNumber: data.orderNumber,
          subtotal: data.subtotal,
          shippingFee: data.shippingFee,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          couponCode: data.couponCode,
          notes: data.notes,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              productImage: item.productImage,
              variantName: item.variantName,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          },
        },
        include: orderInclude,
      });

      await tx.cartItem.deleteMany({ where: { cartId: data.cartId } });

      return order;
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: orderInclude,
    });
  }

  async findByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAll() {
    return prisma.order.findMany({
      include: orderInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByVendor(vendorId: string) {
    return prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              vendorId,
            },
          },
        },
      },
      include: orderInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findLatestOrderNumberForYear(year: number) {
    const latest = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `DM-${year}-`,
        },
      },
      orderBy: {
        orderNumber: "desc",
      },
      select: {
        orderNumber: true,
      },
    });

    return latest?.orderNumber ?? null;
  }

  async updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status: status as Prisma.EnumOrderStatusFieldUpdateOperationsInput },
      include: orderInclude,
    });
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: string
  ) {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as Prisma.EnumPaymentStatusFieldUpdateOperationsInput },
      include: orderInclude,
    });
  }

  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
                variants: true,
              },
            },
            variant: true,
          },
        },
      },
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

  async reduceVariantStock(variantId: string, quantity: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async findAddressById(id: string) {
    return prisma.address.findUnique({
      where: { id },
    });
  }
}
