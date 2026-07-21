export interface OrderWhatsAppPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  county?: string;
  total: number;
  currency?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variantName?: string;
  }>;
}

export interface ProductInquiryPayload {
  productName: string;
  sku?: string | null;
  productId: string;
  selectedSize?: string;
  selectedColor?: string;
}

export class WhatsAppService {
  /**
   * Formats a phone number for wa.me URL (removes non-digits, strips leading zeroes/pluses)
   */
  static cleanPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      // Assuming Kenyan phone number default if starting with 0 (e.g., 0712345678 -> 254712345678)
      cleaned = "254" + cleaned.substring(1);
    }
    return cleaned;
  }

  /**
   * Generates a wa.me URL with encoded message
   */
  static generateUrl(phone: string, message: string): string {
    const cleanPhone = this.cleanPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message.trim());
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Pre-composes a product inquiry message for a customer
   */
  static generateProductInquiry(
    whatsappNumber: string,
    payload: ProductInquiryPayload
  ): string {
    const skuText = payload.sku ? ` (SKU: ${payload.sku})` : "";
    const sizeText = payload.selectedSize ? ` in size ${payload.selectedSize}` : "";
    const colorText = payload.selectedColor ? ` (${payload.selectedColor})` : "";
    
    const message = `Hello DressMe!\n\nI'm interested in the *${payload.productName}*${skuText}${sizeText}${colorText}.\n\nIs it available? Kindly share payment and delivery instructions.`;
    return this.generateUrl(whatsappNumber, message);
  }

  /**
   * Pre-composes an order summary message following checkout
   */
  static generateOrderMessage(
    whatsappNumber: string,
    payload: OrderWhatsAppPayload
  ): string {
    const currency = payload.currency || "KES";
    const formattedTotal = `${currency} ${payload.total.toLocaleString()}`;
    const location = [payload.area, payload.city, payload.county].filter(Boolean).join(", ");
    
    const itemLines = payload.items
      .map((item) => {
        const variant = item.variantName ? ` (${item.variantName})` : "";
        return `• ${item.name}${variant} × ${item.quantity}`;
      })
      .join("\n");

    const message = `Hello DressMe.\n\nI have just placed Order *#${payload.orderNumber}*.\n\n*Name:* ${payload.customerName}\n*Phone:* ${payload.phone}\n*Delivery Location:* ${location}\n\n*Total:* ${formattedTotal}\n\n*Items:*\n${itemLines}\n\nKindly confirm availability and payment instructions.`;

    return this.generateUrl(whatsappNumber, message);
  }
}
